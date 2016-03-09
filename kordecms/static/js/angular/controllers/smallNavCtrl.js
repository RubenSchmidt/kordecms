/**
 * Created by rubenschmidt on 09.03.2016.
 */
kordeCms.controller('smallNavCtrl',
    ['$scope', '$location', '$route', function ($scope, $location, $route) {
        $scope.breadcrumbs = '';
        //Watch the route change, if we are at different page than login, show the navbar.
        $scope.$on('$routeChangeStart', function () {
            //Remove first /
            var cleanPath = $location.path().substring(1);
            // Capitalize first letter.
            var capitalized = cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
            $scope.breadcrumbs = capitalized.replace('/', '>');
        });
    }]);