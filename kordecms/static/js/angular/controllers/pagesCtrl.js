/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('PagesCtrl',
    ['$scope', 'PageFactory', 'ArticleFactory', 'UserFactory', function ($scope, PageFactory, ArticleFactory, UserFactory) {
        PageFactory.list().then(function (response) {
            //Success
            $scope.pages = response.data;

        }, function (response) {
            //Error
            $scope.error = response.data;
        })

        var imagePath = 'img/list/60.jpeg';
          $scope.todos = [];
          for (var i = 0; i < 15; i++) {
            $scope.todos.push({
              face: imagePath,
              what: "Brunch this weekend?",
              who: "Min Li Chan",
              notes: "I'll be in your neighborhood doing errands."
            });
          }
    }]);

kordeCms.controller('TitleController', function($scope) {
  $scope.title = 'My App Title';
});