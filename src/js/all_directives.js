angular.module('ac', []);

angular.module('ac').value('$anchorScroll', null).
  run(['$window', '$templateCache', function ($window, $templateCache) {
    var templates = $window.JST,
        fileName,
        fileContent;

    for (fileName in templates) {
        fileContent = templates[fileName];
        $templateCache.put(fileName, fileContent);
    }
}]);
