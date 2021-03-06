/**
 * Created by rubenschmidt on 24.02.2016.
 */

kordeCms.factory('PageFactory',
    ['$http', 'Upload', 'apiUrl', function ($http, Upload, apiUrl) {
        var endpoint = apiUrl + '/pages';
        return ({
            get: get,
            getChilderen: getChilderen,
            list: list,
            listElements: listElements,
            create: create,
            update: update,
            updateImageElement: updateImageElement,
            destroy: destroy
        });

        function get(pageslug) {
            return $http.get(endpoint + '/' + pageslug)
        }

        function getChilderen(page_id) {
            return $http.get(endpoint + '/childeren/' + page_id);
        }

        function list(filter) {
            return $http.get(endpoint+'?'+filter)
        }

        function listElements(pageslug) {
            return $http.get(endpoint + '/' + pageslug + '/' + 'elements')
        }

        function create(user) {
            return $http.post(endpoint, user)
        }

        function update(pageslug, page) {
            return $http.put(endpoint + '/' + pageslug, page)
        }

        function updateImageElement(file, elementId, elementRow, pageId) {
            return Upload.upload({
                url: endpoint + '/elements/' + elementId,
                method: 'PUT',
                data: {id: elementId, type: 0, row: elementRow, page: pageId},
                file: file
            });
        }

        function destroy(pageslug) {
            return $http.delete('/pages/' + pageslug)
        }
    }]);