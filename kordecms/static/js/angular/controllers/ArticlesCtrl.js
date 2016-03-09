/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('ArticlesCtrl',
    ['$scope', '$location', 'PageFactory', 'ArticleFactory', 'SweetAlert', function ($scope, $location, PageFactory, ArticleFactory, SweetAlert) {

        ArticleFactory.list().then(function (response) {
            //Success
            $scope.articles = response.data;
        }, function (response) {
            //Error
        });

        $scope.delete = function (article) {
            //Show alert popup
            SweetAlert.swal({
                title: 'Vil du slette artikkelen?',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nei',
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    // If the user confirms. Delete the article
                    ArticleFactory.destroy(article).then(function (response) {
                        //Success
                        SweetAlert.swal(
                            'Slettet!',
                            'Artikkelen ble slettet.',
                            'success'
                        );
                    }, function (response) {
                        //Error
                        SweetAlert.swal({
                            title: 'Klarte ikke å slette',
                            type: 'warning',
                            showCancelButton: true,
                            closeOnConfirm: true
                        });
                    });
                }
            });
        };

        $scope.publishedText = function (published) {
            return published ? "Publisert" : "Ikke publisert";
        };

        $scope.isTextElement = function (element) {
            return element.type == 1;
        };

        $scope.getColumnClass = function (element) {
            var classString = "";
            classString += (element.width_type == 1) ? "col-md-12" : "col-md-6";
            classString += (element.type == 1) ? " text-element" : " image-element";

            return classString;
        };

        $scope.go = function (id) {
            $location.path('/articles/' + id);
        };
    }]);