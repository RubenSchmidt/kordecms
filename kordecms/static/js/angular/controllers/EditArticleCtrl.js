/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.controller('EditArticleCtrl',
    ['$scope', '$routeParams','$location', 'PageFactory', 'ArticleFactory', 'SweetAlert', function ($scope, $routeParams, $location ,PageFactory, ArticleFactory, SweetAlert) {
        $scope.editorMode = true;
        $scope.newTagInput = {};
        $scope.article = {};
        //Init empty elements list.
        // Initialize new element with default values
        initNewElement();
        var isNew = true;

        //Set default values for new element
        function initNewElement(){
            $scope.newElement = {
                'type': 1,
                'width_type':0,
                'hasImage': false
            };
        }

        if(!$routeParams.articleId){
            //Create new article object
            isNew = true;
        } else {
            //Get existing article
            ArticleFactory.get($routeParams.articleId).then(function (response) {
                //Success
                $scope.article = response.data;
                $scope.article.tags = getTagList($scope.article);
                isNew = false;
                $scope.newElement.article = $scope.article.id;
        }, function (response) {
            //Error
                console.log(response);
            });
        }

        $scope.pageHeader = function () {
            return isNew ? "Skriv en ny artikkel" : "Rediger artikkel";
        };

        $scope.addNewElement = function(){

            if($scope.newElement.type == 1){
                //We are adding a new text element
                ArticleFactory
                    .addNewElement($scope.newElement)
                    .then(function(response){
                    //Success
                    $scope.article.elements.push(response.data);
                }, function(response){
                    //Error
                    $scope.errors = response.data;
                });
            }else {
                //We are adding a new image element
                if(angular.isUndefined($scope.newElement.file)){
                    SweetAlert.swal({
                        title: 'Du må velge et bilde!',
                        showConfirmButton: true
                    });
                    return;
                }
                //Add a new element, with the file set.
                ArticleFactory
                    .addNewElement($scope.newElement, $scope.newElement.file)
                    .then(function(response){
                    //Success
                    $scope.article.elements.push(response.data);
                }, function(response){
                    //Error
                    $scope.errors = response.data;
                });
            }
        };

        //Save the file from the image upload
        $scope.setNewThumbnailImage = function(file){
            $scope.article.thumbnail_image_src = file;
        };
        //Save the file from the image upload for a new element
        $scope.setNewElementImage = function(file){
            $scope.newElement.file = file;
            console.log(file);
        };


        $scope.setNewElementType = function(type, width){
            //Type is either 0 or 1, if width is set, we are setting the width_type
            if(width){
                $scope.newElement.width_type = type;
            }else {
                $scope.newElement.type = type;
            }
        };

        $scope.saveArticle = function () {
            if (isNew) {
                createArticle();
            } else {
                console.log($scope.article);
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
                $location.path('/articles/' + response.data.id)
            }, function (response) {
                //error
                console.log(response);
                $scope.errors = response.data;
                SweetAlert.swal({title: "Noe gikk galt!", type: "error", showConfirmButton: false, timer: 1000});
            });
        };

        //Vil vi lagre artikkelen hver gang en tag legges til eller slettes?
        $scope.addTag = function (article) {
            var list = article.tag_string.split(',');
            var id = article.id.toString();
            if (list.indexOf($scope.newTagInput[id]) < 0 && $scope.newTagInput[id]) {
                article.tag_string += article.tag_string.length > 0 ? "," + $scope.newTagInput[id] : $scope.newTagInput[id];
                $scope.newTagInput[id] = '';
                ArticleFactory.update(article).then(function (response) {
                    //Success
                }, function (response) {
                    //error
                    console.log(response);
                });
            }
        };

        $scope.deleteTag = function (tag_name, article) {
            var list = article.tag_string.split(',');
            var index = list.indexOf(tag_name);
            if (index > -1) {
                list.splice(index, 1);
            }
            article.tag_string = list.join()
            ArticleFactory.update(article).then(function (response) {
                //Success
            }, function (response) {
                //error
                console.log(response);
            });
        }

        //Pars the tag string as a list or return an empty one.
        function getTagList(article) {
            if(article.tag_string.length > 0){
                return article.tag_string.split(',');
            }else {
                return [];
            }
        }
    }]);