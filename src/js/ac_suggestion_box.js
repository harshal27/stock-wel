angular.module('ac').directive('acSuggestionBox', ['$sce', '$http', '$timeout', '$q', function($sce, $http, $timeout, $q) {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      url: "@acUrl",
      label: "@acLabel",
      helper: "@acHelper",
      error: "=acError",
      placeholder: "@placeholder",
      minChar: "@minChar",
      inputClass: "@inputClass",
      selected_tags: "=acModel",
      suggestions: "=suggestions",
      locked: "@locked",
      onAddCallback: "=onAddCallback",
      onFreeCallback: "=onFreeCallback",
      dropdownWidth: "@dropdownWidth",
      multiple: "@multiple",
      limit: "@limit"
    },
    templateUrl: $sce.trustAsResourceUrl('src/templates/ac_suggestion_box.html'),
    link: function (scope, element, attrs, ctrls, $transclude) {
      var locked = function(){
        return scope.locked == "true";
      };

      var KEY = {
          BACKSPACE: 8,
          TAB: 9,
          ENTER: 13,
          ESCAPE: 27,
          SPACE: 32,
          PAGE_UP: 33,
          PAGE_DOWN: 34,
          END: 35,
          HOME: 36,
          LEFT: 37,
          UP: 38,
          RIGHT: 39,
          DOWN: 40,
          NUMPAD_ENTER: 108,
          COMMA: 188
      };

      var safeApply = function() {
        var phase = scope.$root.$$phase;
        if(phase != '$apply' && phase != '$digest') {
          scope.$apply();
        }
      };

      var dropdown_height = 0;

      var scrollListener = function(){
        var targetElem = $(element).find('.js_target_elem');
        var dropdownElem = $(element).find('.js_suggested_items');
        var offset = targetElem.offset();
        var top = offset.top + targetElem.outerHeight() - $(window).scrollTop();
        dropdownElem.css('position', 'fixed');
        dropdownElem.css('top', top + 'px');
        dropdownElem.css('left', offset.left + 'px');
        dropdownElem.css('width', targetElem.outerWidth() + 'px');
        dropdownElem.css('min-width', scope.dropdownWidth);

        $('body').css('min-height', (offset.top + targetElem.outerHeight() + dropdown_height + 24) + 'px');
        if($('.js_popup').length > 0){
          $('.js_popup').css('min-height', (offset.top - $('.js_popup').offset().top + targetElem.outerHeight() + dropdown_height + 24) + 'px');
        }
      };

      var onBlur = function(){
        if(http_canceller) http_canceller.resolve("another request came");
        scope.term = null;
        scope.fetching = false;
        hide_suggestions();
        safeApply();
      };

      var scrollSelectedItemToMiddle = function(){
        $timeout(function(){
          var scroll = $(element).find('.js_suggested_items').scrollTop() + $(element).find('.js_suggested_items .selected').offset().top -
                       $(element).find('.js_suggested_items').offset().top - $(element).find('.js_suggested_items').height()/2;
          $(element).find('.js_suggested_items').scrollTop(scroll);
        });
      };

      var onKeyUp = function(event){
        if(scope.items && scope.items.length > 0){
          if(event.keyCode == KEY.DOWN){
            if(scope.selected_index < scope.items.length - 1){
              scope.selected_index += 1;
            }else{
              scope.selected_index = 0;
            }
            scrollSelectedItemToMiddle();
          }else if(event.keyCode == KEY.UP){
            if(scope.selected_index > 0){
              scope.selected_index -= 1;
            }else{
              scope.selected_index = scope.items.length - 1;
            }
            scrollSelectedItemToMiddle();
          }else if(event.keyCode == KEY.ENTER){
            if(scope.items[scope.selected_index]){
              scope.selectTag(scope.items[scope.selected_index]);
            }else if(scope.onFreeCallback){
              scope.onFreeCallback(scope.term);
            }
          }
        }else{
          if(event.keyCode == KEY.ENTER && scope.onFreeCallback){
            scope.onFreeCallback(scope.term);
          }
        }
        safeApply();
      };

      var showSuggestions = function(){
        scope.suggestions_dropdown = true;
        document.addEventListener('scroll', scrollListener, true);
//        $(element).find('input').bind('keyup', onKeyUp);
//        $(element).find('input').bind('blur', onBlur);

        var dropdownElem = $(element).find('.js_suggested_items');
        dropdownElem.slideDown(70, function(){
          dropdown_height = dropdownElem.height();
          scrollListener();
          $timeout(function(){
            scrollListener();
          });
        });
      };

      var hide_suggestions = function(){
        dropdown_height = 0;
        scope.suggestions_dropdown = false;
        document.removeEventListener('scroll', scrollListener, true);
//        $(element).find('input').unbind('blur', onBlur);
//        $(element).find('input').unbind('keyup', onKeyUp);
        $('body').css('min-height', '0px');
        $('.js_popup').css('min-height', '0px');
        var dropdownElem = $(element).find('.js_suggested_items');
        dropdownElem.hide();
      };

      var http_canceller = null;

      var fetchSuggestions = function(){
        if(http_canceller) http_canceller.resolve("another request came");
        hide_suggestions();

        if(!(scope.term) || scope.term.length < minChar || locked()){
          if(scope.suggestions && scope.suggestions.length > 0){
            scope.selected_index = -1;
            scope.items = scope.suggestions;
            if(scope.term){
              var term = scope.term.toLowerCase().replace(/\W+/g, "");
              scope.items = $.grep(scope.suggestions, function (row) {
                  return row.name.toLowerCase().replace(/\W+/g, "").indexOf(term) > -1;
              });
            }
            showSuggestions();
          }
          return true;
        }

        scope.fetching = true;
        safeApply();
        http_canceller = $q.defer();
        $http({
          method: "GET",
          url: scope.url,
          params: {q: scope.term},
          timeout: http_canceller.promise
        }).success(function(response){
          scope.selected_index = -1;
          scope.items = response;
          scope.fetching = false;
          showSuggestions();
        });
      };

      scope.debouncedFetchSuggestions = _.debounce(fetchSuggestions, 300);

      scope.removeTag = function(index){
        if(scope.multiple){
          scope.selected_tags.splice(index, 1);
        }else{
          scope.selected_tags = null;
        }
      };

      scope.selectTag = function(item){
        if(scope.multiple){
          var matching_index = -1;
          angular.forEach(scope.selected_tags, function(selected_tag, index){
            if(selected_tag.id == item.id) matching_index = index;
          });
          if(matching_index == -1){
            scope.selected_tags.push(item);
          }
        }else{
          scope.selected_tags = item;
        }
        if(scope.onAddCallback){
          $timeout(function(){
            scope.onAddCallback(item);
          });
        }
        onBlur();
      };

      scope.highlightTag = function(index){
        scope.selected_index = index;
      };

      scope.itemType = function(type){
        if(!type) return 'default';
        if(type == 'Location') return 'location';
        if(type.indexOf('Institution') != -1) return 'institution';
        return 'user';
      };

      scope.bgClass = function(type){
        if(type == 'company' || type == 'joining_year') return 'bg-turquoise-light';
        if(type == 'current_city' || type == 'graduation_year') return 'bg-rosyPink-light';
        if(type == 'user_type' || type == 'open_for') return 'bg-darkSkyBlue-light';
        if(type == 'campus') return 'bg-sunflowerYellow-light';
        if(type == 'course' || type == 'branch') return 'bg-sicklyYellow-light';
        return 'bg-sicklyYellow-light';
      };

      var minChar = 2;
      if(scope.minChar) minChar = parseInt(scope.minChar);
      scope.selected_index = -1;

      if(!(scope.multiple)) scope.multiple = false;
      if(scope.multiple) scope.multiple = (scope.multiple == "true");
      if(scope.multiple && !(scope.selected_tags)) scope.selected_tags = [];
      scope.onBlur = onBlur;
      scope.onKeyUp = onKeyUp;
      if(scope.limit) scope.limit = parseInt(scope.limit);
      if(!(scope.limit)) scope.limit = 100;
    }
  };
}]);
