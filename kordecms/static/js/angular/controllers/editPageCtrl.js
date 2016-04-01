/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('EditPageCtrl',
    ['$scope', '$routeParams', '$location', 'PageFactory', 'Upload', function ($scope, $routeParams, $location, PageFactory, Upload) {
        $scope.page = {};

        PageFactory.get($routeParams.pageSlug).then(function (response) {
            //Success
            $scope.page = response.data;
            $scope.pageElements = $scope.page.elements;

            PageFactory.getChilderen($scope.page.id).then(function (response) {
                //Success
                $scope.page.children = response.data;
                // Check for children on the child page.
                $scope.page.children.forEach(function (page) {
                    PageFactory.getChilderen(page.id).then(function (response) {
                        //Success
                        page.subPageCount = response.data.length;

                    }, function (response) {
                        //Error
                        page.subPageCount = 0;
                    });
                })


            }, function (response) {
                //Error

            });

        }, function (response) {
            //Error
            $scope.error = response.data;
        });

        $scope.checkChildren = function () {
            if ($scope.page.children) {
                return $scope.page.children.length > 0;
            }
            return false;
        };

        $scope.checkElements = function () {
            if ($scope.pageElements) {
                return $scope.pageElements.length > 0;
            }
            return false;
        };

        $scope.go = function (slug) {
            $location.path('/pages/' + slug);
        };

    }]);
