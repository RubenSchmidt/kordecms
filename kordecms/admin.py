from django.contrib import admin
from .models import Article, ArticleComment, Page, PageElement, ArticleElement


# Register your models here.

class PageElementInline(admin.StackedInline):
    model = PageElement
    exclude = ('class_type', )


class PageAdmin(admin.ModelAdmin):
    model = Page
    inlines = [
        PageElementInline
    ]


class PageElementAdmin(admin.ModelAdmin):
    model = PageElement


class ArticleCommentInline(admin.TabularInline):
    model = ArticleComment


class ArticleElementInline(admin.TabularInline):
    model = ArticleElement


class ArticleAdmin(admin.ModelAdmin):
    inlines = [
        ArticleCommentInline,
        ArticleElementInline
    ]


class ArticleElementAdmin(admin.ModelAdmin):
    model = ArticleElement


admin.site.register(Article, ArticleAdmin)
admin.site.register(Page, PageAdmin)
admin.site.register(PageElement, PageElementAdmin)
admin.site.register(ArticleElement, ArticleElementAdmin)
