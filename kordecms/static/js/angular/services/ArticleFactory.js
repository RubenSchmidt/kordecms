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
            updateElement: updateElement,
            destroyElement: destroyElement,
            destroy: destroy,
            count: count
        });
        function get(slug) {
            return $http.get(endpoint + '/' + slug)
        }

        function list() {
            return $http.get(endpoint)
        }

        function create(article, file) {
            //Check for file existance
            if (angular.isUndefined(file)) {
                return $http.post(endpoint, article)
            } else {
                return Upload.upload({
                    url: endpoint,
                    method: 'POST',
                    data: article,
                    file: file
                });
            }
        }

        function update(article, file) {
            if (angular.isUndefined(file)) {
                return $http.put(endpoint + '/' + article.slug, article)
            } else {
                return Upload.upload({
                    url: endpoint + '/' + article.slug,
                    method: 'PUT',
                    data: article,
                    file: file
                });
            }
        }

        function addNewElement(element, file) {
            if (angular.isUndefined(file)) {
                return $http.post(endpoint + '/' + element.article + '/elements', element)
            } else {
                return Upload.upload({
                    url: endpoint + '/' + element.article + '/elements',
                    method: 'POST',
                    data: element,
                    file: file
                });
            }
        }

        function destroyElement(element) {
            return $http.delete(endpoint + '/' + element.article + '/elements/' + element.id)
        }

        function updateElement(element, file) {
            if (angular.isUndefined(file)) {
                return $http.put(endpoint + '/' + element.article + '/elements/' + element.id, element)
            } else {
                return Upload.upload({
                    url: endpoint + '/' + element.article + '/elements/' + element.id,
                    method: 'PUT',
                    data: element,
                    file: file
                });
            }

        }

        function destroy(slug) {
            return $http.delete(endpoint + '/' + slug)
        }

        function count() {
            return $http.get(endpoint + '/count')
        }
    }]);