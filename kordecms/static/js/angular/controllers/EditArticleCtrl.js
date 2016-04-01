/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('EditArticleCtrl',
    ['$scope', '$routeParams', '$location', '$timeout', 'PageFactory', 'ArticleFactory', 'SweetAlert', 'textAngularManager', function ($scope, $routeParams, $location, $timeout, PageFactory, ArticleFactory, SweetAlert, textAngularManager) {
        $scope.editorMode = true;
        $scope.newTagInput = {};
        $scope.article = {};
        $scope.disabled = true;
        //Init this so the tabs work poperly
        $scope.article.tags = [];
        //Init empty elements list.
        $scope.isNew = true;

        if (!$routeParams.articleSlug) {
            //Create new article object
            $scope.isNew = true;
        } else {
            //Get existing article
            ArticleFactory.get($routeParams.articleSlug).then(function (response) {
                //Success
                $scope.article = response.data;
                $scope.isNew = false;
            }, function (response) {
                //Error
                console.log(response);
                SweetAlert.swal({title: "Noe gikk galt!", type: "error", showConfirmButton: false, timer: 1000});
            });
        }


        $scope.startNewElement = function (type, width) {
            // Text element
            if (type == 1) {
                $scope.newElement = {
                    'type': type,
                    'width_type': width,
                    'hasImage': false
                };
                // Image element
            } else if (type == 0) {
                $scope.newElement = {
                    'type': type,
                    'width_type': width,
                    'hasImage': true
                };
            }
            // Set the element to the current article
            $scope.newElement.article = $scope.article.id;
        };

        $scope.cancelNewElement = function () {
            //User cancels the new element. Set it to null so it doesnt get sent with the article update
            $scope.newElement = null;
        };

        $scope.pageHeader = function () {
            return $scope.isNew ? "Skriv en ny artikkel" : "Rediger artikkel";
        };

        $scope.addNewElement = function () {

            if ($scope.newElement.type == 1) {
                //We are adding a new text element
                ArticleFactory
                    .addNewElement($scope.newElement)
                    .then(function (response) {
                        //Success
                        $scope.article.elements.push(response.data);
                    }, function (response) {
                        //Error
                        $scope.errors = response.data;
                        SweetAlert.swal({
                            title: "Noe gikk galt!",
                            type: "error",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    });
            } else {
                //We are adding a new image element
                if (angular.isUndefined($scope.newElement.file)) {
                    SweetAlert.swal({
                        title: 'Du må velge et bilde!',
                        showConfirmButton: true
                    });
                    return;
                }
                //Add a new element, with the file set.
                ArticleFactory
                    .addNewElement($scope.newElement, $scope.newElement.file)
                    .then(function (response) {
                        //Success
                        $scope.article.elements.push(response.data);
                    }, function (response) {
                        //Error
                        $scope.errors = response.data;
                        SweetAlert.swal({
                            title: "Noe gikk galt!",
                            type: "error",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    });
            }
            // Reset the element
            $scope.newElement = null;
        };


        $scope.updateElement = function (element) {
            ArticleFactory.updateElement(element).then(function (response) {
                //Success
                SweetAlert.swal({title: "Lagret", type: "success", showConfirmButton: false, timer: 1000});
            }, function (response) {
                //Error
                SweetAlert.swal({
                    title: "Noe gikk galt!",
                    text: "Elementet ble ikke oppdatert",
                    type: "error",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
        };

        $scope.deleteElement = function (element, index) {
            ArticleFactory.destroyElement(element).then(function (response) {
                //Success
                SweetAlert.swal({title: "Slettet", type: "success", showConfirmButton: false, timer: 1000});
                // Remove the element from the list in the DOM.
                $scope.article.elements.splice(index, 1)
            }, function (response) {
                //Error
                SweetAlert.swal({
                    title: "Noe gikk galt!",
                    text: "Elementet ble ikke slettet!",
                    type: "error",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
        };


        //Save the file from the image upload
        $scope.setNewThumbnailImage = function (file) {
            $scope.article.thumbnail_image_src = file;
        };
        //Save the file from the image upload for a new element
        $scope.setNewElementImage = function (file) {
            $scope.newElement.file = file;
        };

        //Set a new image for an existing element
        $scope.setElementImage = function (file, element, index) {
            element.image_src = file;
            ArticleFactory.updateElement(element, file).then(function(response){
                //Success
                SweetAlert.swal({title: "Lagret", type: "success", showConfirmButton: false, timer: 1000});
                // Update the DOM element
                $scope.article.elements[index] = response.data;
            }, function(response){
                //Error
                SweetAlert.swal({
                    title: "Noe gikk galt!",
                    text: "Bildet ble ikke lagret",
                    type: "error",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
        };


        $scope.setNewElementType = function (type, width) {
            //Type is either 0 or 1, if width is set, we are setting the width_type
            if (width) {
                $scope.newElement.width_type = type;
            } else {
                $scope.newElement.type = type;
            }
        };

        $scope.saveArticle = function () {
            if ($scope.isNew) {
                createArticle();
            } else {
                if ($scope.newElement) {
                    // There is a new element in the scope, add it before saving the article
                    $scope.addNewElement();
                }

                //Update the article
                ArticleFactory.update($scope.article, $scope.article.thumbnail_image_src).then(function (response) {
                    //Success
                    SweetAlert.swal({title: "Lagret", type: "success", showConfirmButton: false, timer: 1000});
                    $location.path('/articles')
                }, function (response) {
                    console.log(response);
                    SweetAlert.swal({title: "Noe gikk galt!", type: "error", showConfirmButton: false, timer: 1000});
                });
            }
        };

        var createArticle = function () {
            //Set the elements variable
            $scope.article.elements = [];
            ArticleFactory.create($scope.article, $scope.article.thumbnail_image_src).then(function (response) {
                //Success, redirect to the article page
                $location.path('/articles/' + response.data.slug)
            }, function (response) {
                //error
                $scope.errors = response.data;
                SweetAlert.swal({title: "Noe gikk galt!", type: "error", showConfirmButton: false, timer: 1000});
            });
        };


        //Method used to show the edit element buttons on focus.
        $scope.showEditButtons = function (elementId) {
            $scope.showButtonsFor = elementId;
        };
        //Method used to hide the edit element buttons on blur
        $scope.hideEditButtons = function (elementId) {
            // Wait 500 milliseconds before hiding, so if a user clicks one of the buttons, the click is registered.
            //Note the passing of the elementId in the last parameter if the timeout
            $timeout(function (elementId) {
                var id = $scope.showButtonsFor;
                if (elementId != id && id != null) {
                    //The user has clicked directly on another element. If we set it to null now, the function will fail.
                    return
                }
                $scope.showButtonsFor = null;
            }, 500, true, elementId);
        }

        $scope.go = function (path) {
            $location.path(path);
        }

    }]);