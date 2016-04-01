/**
 * Created by rubenschmidt on 09.03.2016.
 */
kordeCms.controller('smallNavCtrl',
    ['$scope', '$location', '$route', function ($scope, $location, $route) {
        $scope.breadcrumbs = '';
        //Watch the route change, if we are at different page than login, show the navbar.
        $scope.$on('$routeChangeStart', function () {
            var tempList = $location.path().split('/');
            var pathList = [];
            tempList.forEach(function (n) {
                // Clean the array for emptry strings.
                if (n) {
                    pathList.push(n)
                }
            });
            var outString = '';
            pathList.forEach(function (path, idx, array) {
                // Capitalize the word
                var cap = path.charAt(0).toUpperCase() + path.slice(1);
                if (idx !== array.length - 1) {
                    cap = cap + '>';
                }
                outString += cap;
            });

            $scope.breadcrumbs = outString;
        });
    }]);