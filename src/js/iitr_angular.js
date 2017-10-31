angular.module('StaticWebsite', ['ngSanitize']);

angular.module('StaticWebsite').value('$anchorScroll', null).
  run(['$window', '$templateCache', function ($window, $templateCache) {
    var templates = $window.JST,
        fileName,
        fileContent;

    for (fileName in templates) {
        fileContent = templates[fileName];
        $templateCache.put(fileName, fileContent);
    }
}]);

angular.module('StaticWebsite').controller('MainController', ['$scope', '$http', '$timeout',
function($scope, $http, $timeout) {
}]);
