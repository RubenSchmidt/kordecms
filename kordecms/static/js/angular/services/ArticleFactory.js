/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.factory('ArticleFactory',
    ['$http', 'apiUrl', 'Upload', function ($http, apiUrl, Upload) {
        var endpoint = apiUrl + '/articles';
        return ({
            get: get,
            list: list,
            create: create,
            update: update,
            addNewElement: addNewElement,
            destroy: destroy,
            count: count
        });
        function get(id) {
            return $http.get(endpoint + '/' + id)
        }

        function list() {
            return $http.get(endpoint)
        }

        function create(article, file) {
            //Check for file existance
            if(angular.isUndefined(file)){
                return $http.post(endpoint, article)
            }else {
                return Upload.upload({
                    url: endpoint,
                    method: 'POST',
                    data: article,
                    file: file
                });
            }
        }

        function update(article, file) {
            if(angular.isUndefined(file)){
                return $http.put(endpoint + '/' + article.id, article)
            }else {
                return Upload.upload({
                    url: endpoint + '/' + article.id,
                    method: 'PUT',
                    data: article,
                    file: file
                });
            }
        }

        function addNewElement(element, file) {
            if(angular.isUndefined(file)){
                return $http.post(endpoint + '/' + element.article + '/elements', element)
            }else {
                return Upload.upload({
                    url: endpoint + '/' + element.article +'/elements',
                    method: 'POST',
                    data: element,
                    file: file
                });
            }
        }

        function destroy(id) {
            return $http.delete(endpoint + '/' + id)
        }

        function count() {
            return $http.get(endpoint + '/count')
        }
    }]);