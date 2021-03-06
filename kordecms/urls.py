from django.conf.urls import url, include
from . import views
from rest_framework import routers
import rest_framework_jwt.views


urlpatterns = [
    # url(r'rest/jobtitles', views.get_all_job_titles),
    # url(r'rest/userratings/(?P<id>\d+)', views.get_ratings_view),
    url(r'^admin', views.index_view, name='index-view'),

    url(r'^api-token-auth/', rest_framework_jwt.views.obtain_jwt_token),
    url(r'^api-token-verify/', rest_framework_jwt.views.verify_jwt_token),

    url(r'^pages$', views.PageList.as_view(), name='page-list'),
    url(r'^pages/(?P<slug>[-_\w]+)$', views.PageDetail.as_view(), name='page-detail'),
    url(r'^pages/(?P<slug>[-_\w]+)/elements$', views.get_page_elements_sorted, name='page-element-sorted'),
    url(r'^pageelements/(?P<pk>\d+)$', views.PageElementDetail.as_view(), name='page-element-detail'),
    url(r'^pages/childeren/(?P<page_id>\d+)$', views.page_childeren, name='page-childeren'),


    url(r'^users$', views.UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>\d+)$', views.UserDetail.as_view(), name='user-detail'),
    url(r'^users/(?P<pk>\d+)/articles$', views.UserArticleList.as_view(), name='user-articles-list'),
    url(r'^users/current-user$', views.current_user, name='current-user'),

    url(r'^articles$', views.ArticleList.as_view(), name='article-list'),
    url(r'^articles/(?P<slug>[-_\w]+)$', views.ArticleDetail.as_view(), name='article-detail'),
    url(r'^articles/(?P<slug>[-_\w]+)/comments$', views.ArticleCommentList.as_view(), name='article-comments-list'),
    url(r'^articles/(?P<slug>[-_\w]+)/elements$', views.ArticleElementList.as_view(), name='article-elements-list'),
    url(r'^articles/(?P<slug>[-_\w]+)/elements/(?P<elementId>\d+)$', views.ArticleElementDetail.as_view(), name='article-elements-detail'),
    url(r'^articles/count/$', views.article_count, name='article-count'),
    url(r'^articles/internal/$', views.InternalArticleList.as_view(), name='article-internal-list'),


    url(r'^comments/(?P<pk>\d+)$', views.ArticleCommentDetail.as_view(), name='article-comment-detail'),
]
