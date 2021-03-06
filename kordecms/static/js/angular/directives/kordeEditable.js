/**
 * Created by rubenschmidt on 24.02.2016.
 */
kordeCms.directive('kordeEditable', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            if (!scope.editorMode) {
                return;
            }
            if (!attrs.kordeModel) {
                return;
            }
            var kordeModelValue;

            scope.$watch(attrs.kordeModel, function (value) {
                kordeModelValue = value;
            });

            element.hallo({
                plugins: {
                    'halloformat': {"bold": true, "italic": true, "strikethrough": true, "underline": true},
                    'halloheadings': [1, 2, 3],
                    'hallojustify': {},
                    'hallolists': {},
                    'halloreundo': {}
                },
                toolbar: 'halloToolbarFixed'
            });

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            element.on('hallodeactivated', function () {
                ngModel.$setViewValue(element.html());
                scope.$apply();
                //Send the broadcast event
                $rootScope.$broadcast('rootScope:doneEditing', kordeModelValue);
            });

        }
    }
}]);