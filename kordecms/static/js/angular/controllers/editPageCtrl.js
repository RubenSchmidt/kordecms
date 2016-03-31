/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('EditPageCtrl',
    ['$scope', '$routeParams', 'PageFactory', 'Upload', function ($scope, $routeParams, PageFactory, Upload) {
        $scope.page = {};

        PageFactory.get($routeParams.pageSlug).then(function (response) {
            //Success
            $scope.page = response.data;
            $scope.pageElements = $scope.page.elements;

            PageFactory.getChilderen($scope.page.id).then(function(response){
                //Success
                $scope.page.children = response.data;
            }, function(response){
                //Error

            });

        }, function (response) {
            //Error
            $scope.error = response.data;
        });

        $scope.checkChildren = function () {
            return $scope.page.children.length > 0;
        };

        $scope.checkElements = function () {
            return $scope.pageElements.length >0;
        }

    }]);
