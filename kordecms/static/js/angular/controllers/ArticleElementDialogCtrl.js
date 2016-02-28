/**
 * Created by Ruben on 28.02.2016.
 */
kordeCms.controller('ArticleElementDialogCtrl',
    ['$scope', '$mdDialog', 'ArticleFactory', 'article', function ($scope, $mdDialog, ArticleFactory, article) {
        $scope.article = article;

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }]);