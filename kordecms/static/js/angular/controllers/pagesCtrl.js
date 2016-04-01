/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.controller('PagesCtrl',
    ['$scope', '$location' ,'PageFactory', 'ArticleFactory', 'UserFactory', function ($scope, $location ,PageFactory, ArticleFactory, UserFactory) {
        PageFactory.list('parent_page=True').then(function (response) {
            //Success
            $scope.pages = response.data;

            $scope.pages.forEach(function (page) {
                subPageCount(page);
            })

        }, function (response) {
            //Error
            $scope.error = response.data;
        });

        function subPageCount (page) {
            PageFactory.getChilderen(page.id).then(function(response){
                //Success
                page.subPageCount = response.data.length;

            }, function(response){
                //Error
                page.subPageCount = 0;
            });
        }
        $scope.go = function (slug) {
            $location.path('/pages/' + slug);
        };
    }]);