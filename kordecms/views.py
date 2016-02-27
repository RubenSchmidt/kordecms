from django.contrib.auth.models import User
from kordecms.models import Page, Article, ArticleComment, PageElement, ArticleElement
from kordecms.permissions import ArticleAuthorCanEditPermission, IsAdminOrReadOnly
from kordecms.serializers import ArticleSerializer, ArticleCommentSerializer, UserSerializer, PageSerializer, \
    PageElementSerializer, ArticleElementSerializer
from django.utils.translation import ugettext_lazy as _
from rest_framework import permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render


def index_view(request):
    return render(request, 'cmsadmin.html', {})


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(generics.ListCreateAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = [
        permissions.IsAdminUser
    ]


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class PageList(generics.ListCreateAPIView):
    model = Page
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [
        IsAdminOrReadOnly
    ]


class PageDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Page
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = 'slug'
    permission_classes = [
        IsAdminOrReadOnly
    ]


class PageElementDetail(generics.RetrieveUpdateDestroyAPIView):
    model = PageElement
    queryset = PageElement.objects.all()
    serializer_class = PageElementSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def perform_update(self, serializer):
        # Type is image
        file = self.request.FILES.get('file')
        # If a new image is added, save it. Will be none if not.
        serializer.save(image_src=file)


class PageElementList(generics.ListAPIView):
    model = PageElement
    queryset = PageElement.objects.all()
    serializer_class = PageElementSerializer
    lookup_field = 'slug'
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        queryset = super(PageElementList, self).get_queryset()
        return queryset.filter(page__slug=self.kwargs.get('slug'))


class ArticleMixin(object):
    model = Article
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer

    permission_classes = [
        ArticleAuthorCanEditPermission
    ]

    def perform_create(self, serializer):
        # Try to get the file, return None if not found.
        file = self.request.FILES.get('file')
        serializer.save(author=self.request.user, thumbnail_image_src=file)

    def perform_update(self, serializer):
        # Try to get the file, return None if not found.
        file = self.request.FILES.get('file')
        serializer.save(thumbnail_image_src=file)


class ArticleList(ArticleMixin, generics.ListCreateAPIView):

    def get_queryset(self):
        """
        Optionally limit the number of articles returned.
        """
        queryset = self.get_queryset()
        limit = self.request.query_params.get('limit', None)
        if limit is not None:
            return queryset[:limit]
        return queryset


class ArticleDetail(ArticleMixin, generics.RetrieveUpdateDestroyAPIView):
    pass


class ArticleElementList(generics.ListCreateAPIView):
    model = ArticleElement
    queryset = ArticleElement.objects.all()
    serializer_class = ArticleElementSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        queryset = super(ArticleElementList, self).get_queryset()
        return queryset.filter(article_id=self.kwargs.get('pk'))

    def perform_create(self, serializer):
        obj = serializer.validated_data
        # Type is image
        if obj['type'] == 0:
            # New image file is uploaded
            if self.request.FILES.get('file'):
                serializer.save(image_src=self.request.FILES.get('file'))
                return
        # save the normal way
        serializer.save()


class UserArticleList(generics.ListAPIView):
    model = Article
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = super(UserArticleList, self).get_queryset()
        return queryset.filter(author__id=self.kwargs.get('author_id'))


class ArticleCommentMixin(object):
    model = ArticleComment
    serializer_class = ArticleCommentSerializer
    queryset = ArticleComment.objects.all()

    def perform_create(self, serializer):
        """Force author to the current user on save"""
        serializer.save(author=self.request.user)


class ArticleCommentList(ArticleCommentMixin, generics.ListAPIView):
    def get_queryset(self):
        queryset = super(ArticleCommentList, self).get_queryset()
        return queryset.filter(article__id=self.kwargs.get('id'))


class ArticleCommentDetail(ArticleCommentMixin, generics.RetrieveUpdateDestroyAPIView):
    pass


@api_view(['GET'])
def article_count(request):
    """
    Returns the amount of published and unpublished articles
    :param request:
    """
    article_count_p = Article.objects.filter(is_published=True).count()
    article_count_u = Article.objects.filter(is_published=False).count()
    return Response({
        'article_count_p': article_count_p,
        'article_count_u': article_count_u
    })
