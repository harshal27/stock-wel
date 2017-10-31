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

angular.module('ac').directive('acDropdown', ['$sce', function($sce) {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      dropdown: "=acDropdown",
    },
    templateUrl: $sce.trustAsResourceUrl('src/templates/ac_dropdown.html'),
    link: function (scope, element, attrs, ctrls, $transclude) {
      scope.dropdown = {};

      scope.dropdown.closeDropdown = function() {
        scope.dropdown.show_dropdown = null;
      };

      scope.dropdown.showDropdown = function(){
        scope.dropdown.show_dropdown = true;
      };
    }
  };
}]);
