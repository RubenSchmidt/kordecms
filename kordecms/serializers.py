from rest_framework import serializers
from .models import Page, Article, ArticleComment, PageElement, ArticleElement
from django.contrib.auth.models import User
from taggit_serializer.serializers import (TagListSerializerField,
                                           TaggitSerializer)


class PageElementSerializer(serializers.ModelSerializer):
    # Set the page to read only so we bypass the null check when updating a page and it elements
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = PageElement


class PageSerializer(serializers.ModelSerializer):
    elements = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ('id', 'name', 'parent_page', 'slug', 'thumbnail', 'thumbnail_url', 'display_title', 'elements')

    def create(self, validated_data):
        """
        Pops the element array and saves all of the elements individually.
        """
        elements_data = validated_data.pop('elements')
        page = Page.objects.create(**validated_data)
        for element_data in elements_data:
            PageElement.objects.create(page=page, **element_data)
        return page

    def get_elements(self, obj):
        qset = PageElement.objects.filter(page=obj).order_by('row', 'col')
        ser = PageElementSerializer(qset, many=True)
        return ser.data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                # checking if password is changed to avoid double hashing
                if instance.password != value:
                    instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class ArticleElementSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = ArticleElement
        fields = ('id', 'article', 'type', 'width_type', 'text', 'image_url')


class ArticleSerializer(TaggitSerializer, serializers.ModelSerializer):
    # Creates a nested relationship with all its elements, the related name is set in ArticleElement
    elements = ArticleElementSerializer(many=True, read_only=True)
    thumbnail_image_url = serializers.ReadOnlyField()
    tags = TagListSerializerField(required=False)

    class Meta:
        model = Article
        fields = (
            'id', 'title', 'author_name', 'body_text', 'thumbnail_image_url', 'created_at', 'tags', 'author',
            'elements', 'slug', 'is_published', 'is_internal')


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleComment
