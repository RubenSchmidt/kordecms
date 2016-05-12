from ckeditor.widgets import CKEditorWidget
from django.contrib import admin
from django.db import models
from .models import Article, ArticleComment, Page, PageElement, ArticleElement


# Register your models here.

class PageElementInline(admin.StackedInline):
    model = PageElement
    exclude = ('class_type', )
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget()},
    }


class PageAdmin(admin.ModelAdmin):
    model = Page
    inlines = [
        PageElementInline
    ]


class PageElementAdmin(admin.ModelAdmin):
    model = PageElement
    list_filter = ('page')
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget()},
    }


class ArticleCommentInline(admin.TabularInline):
    model = ArticleComment


class ArticleElementInline(admin.TabularInline):
    model = ArticleElement
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget()},
    }


class ArticleAdmin(admin.ModelAdmin):
    inlines = [
        ArticleElementInline,
        ArticleCommentInline
    ]
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget()},
    }


class ArticleElementAdmin(admin.ModelAdmin):
    model = ArticleElement


admin.site.register(Article, ArticleAdmin)
admin.site.register(Page, PageAdmin)
admin.site.register(PageElement, PageElementAdmin)
admin.site.register(ArticleElement, ArticleElementAdmin)
