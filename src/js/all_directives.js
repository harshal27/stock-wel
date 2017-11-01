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

angular.module('ac').directive('ngCustomIf', ['$animate', function($animate) {
  function toBoolean(value) {
    if (typeof value === 'function') {
      value = true;
    } else if (value && value.length !== 0) {
      var v = angular.lowercase("" + value);
      value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
    } else {
      value = false;
    }
    return value;
  }

  function getBlockElements(nodes) {
    var startNode = nodes[0],
        endNode = nodes[nodes.length - 1];
    if (startNode === endNode) {
      return (startNode);
    }

    var element = startNode;
    var elements = [element];

    do {
      element = element.nextSibling;
      if (!element) break;
      elements.push(element);
    } while (element !== endNode);

    return (elements);
  }

  return {
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function ($scope, $element, $attr, ctrl, $transclude) {
        var block, previousElements;
        $scope.$watch($attr.ngCustomIf, function ngCustomIfWatchAction(newValue, oldValue) {

          if (toBoolean(newValue)) {
            if(!previousElements){
              $transclude($scope, function (clone) {
                clone[clone.length] = document.createComment(' end ngCustomIf: ' + $attr.ngCustomIf + ' ');
                clone.length = clone.length + 1;
                block = {
                  clone: clone
                };
                previousElements = clone;
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          } else {
            if(previousElements) {
              $(previousElements).remove();
              previousElements = null;
            }
            if(block) {
              previousElements = getBlockElements(block.clone);
              $(previousElements).remove();
              block = null;
              previousElements = null;
            }
          }
        }, true);
    }
  };
}]);

angular.module('ac').directive('acEvent', ['$parse', function ($parse) {
  return function (scope, elm, attrs) {
    var events = scope.$eval(attrs.acEvent);
    angular.forEach(events, function (acEvent, eventName) {
      var fn = $parse(acEvent);
      elm.bind(eventName, function (evt) {
        var params = Array.prototype.slice.call(arguments);
        //Take out first paramater (event object);
        params = params.splice(1);
        scope.$apply(function () {
          fn(scope, {$event: evt, $params: params});
        });
      });
    });
  };
}]);

/*
<div ac-concat="[o1, s1, o2, s2, o3]"></div>
*/
angular.module('ac').directive('acConcat', ['$rootScope', function($rootScope) {
  return function(scope, element, attrs) {

    var prepareLink = function(value) {
      if (!value) return;
      if (typeof(value) != "object") return value.toString();
      if (!value.name) return;
      if (!value.url) return value.name;

      result = '<a href="' + value.url + '" class="ac_link">' + value.name + '</a>';
      return result;
    };

    var concat = function(v1, seperator, v2) {
      return [prepareLink(v1), prepareLink(v2)].filter(String).filter(Boolean).join(seperator);
    };

    var appendCombinedText = function(){
      var values = scope.$eval(attrs.acConcat);
      while(values.length > 1){
        var objects = values.splice(0, 3);
        var output = concat(objects[0], objects[1], objects[2]);
        values.splice(0, 0, output);
      }

      element.html(values[0]);
    };
    appendCombinedText();

    if(attrs.acChangeable){
      scope.$watch(attrs.acChangeable, function(){
        appendCombinedText();
      }, true);
    }
  };
}]);
