/**
 * Created by rubenschmidt on 16.02.2016.
 */
var kordeCms = angular.module("kordeCms", ['ngCookies', 'ngRoute', 'ngSanitize', 'ngFileUpload', 'youtube-embed', 'ngMaterial', 'ngMessages', 'textAngular']);

kordeCms.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'DashboardCtrl',
            templateUrl: '/static/partials/dashboard.html',
            isRestricted: true
        })
        .when('/articles/new/', {
            controller: 'EditArticleCtrl',
            templateUrl: '/static/partials/edit-article.html',
            isRestricted: true
        })
        .when('/articles/:articleSlug', {
            controller: 'EditArticleCtrl',
            templateUrl: '/static/partials/edit-article.html',
            isRestricted: true
        })
        .when('/users/:userId', {
            controller: 'EditUserCtrl',
            templateUrl: '/static/partials/edit-user.html',
            isRestricted: true
        })
        .when('/users', {
            controller: 'UsersCtrl',
            templateUrl: '/static/partials/users.html',
            isRestricted: true
        })
        .when('/articles', {
            controller: 'ArticlesCtrl',
            templateUrl: '/static/partials/articles.html',
            isRestricted: true
        })
        .when('/pageelement/:id', {
            controller: 'PageElementCtrl',
            templateUrl: '/static/partials/page-element.html',
            isRestricted: true
        })
        .when('/pages/:pageSlug/', {
            controller: 'EditPageCtrl',
            templateUrl: '/static/partials/edit-page.html',
            isRestricted: true
        })
        .when('/pages', {
            controller: 'PagesCtrl',
            templateUrl: '/static/partials/pages.html',
            isRestricted: true
        })
        .when('/login', {
            controller: 'LoginCtrl',
            templateUrl: '/static/partials/login.html',
            isRestricted: false
        })
        .when('/new-user', {
            controller: 'NewUserCtrl',
            templateUrl: '/static/partials/new-user.html',
            isRestricted: true
        })
        .otherwise('/login')
}]);

kordeCms.run(function ($rootScope, $location, $route, AuthService) {

    $rootScope.$on('$routeChangeStart', function (event, next) {
        // Check if the user is logged in.
        if (!AuthService.isLoggedIn() && next.isRestricted) {
            //Get the auth status of the user, if it goes trough we have a valid token.
            AuthService.getAuthStatus().then(function () {
                //Success, we have a valid token. Let the user continue.
            }, function () {
                //Error, user is not authenticated
                //save the user's location to take him back to the same page after he has logged-in
                $rootScope.savedLocation = $location.url();
                $location.path('/login');
                $route.reload();
            });
        }
    });
});

kordeCms.value('apiUrl', '/cms');
