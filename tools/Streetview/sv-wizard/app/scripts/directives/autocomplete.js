var svWizard = svWizard || {};
svWizard.directives = svWizard.directives || {};

svWizard.directives.mapAutocomplete = (function(){
  /**
   * The mapAutocomplete (map-autocomplete) directive has to be applied in an 
   * input method. It will provide the Google Maps autocomplete feature to 
   * this input element. Once the user selects a place, the function provided
   * in the directive value will be called with the selected result.
   * @member {Directive} mapAutocomplete
   * @memberOf svWizard.directives
   */
  var mapAutocomplete = function($timeout) {
    return {
      restrict: 'A',
      scope: {
        mapAutocomplete: '&'
      },
      link: function(scope, element, attrs) {
        var autocomplete = new google.maps.places.Autocomplete(element[0]);
        autocomplete.addListener('place_changed', function(){
          scope.$apply();
          $timeout(function() {
            scope.mapAutocomplete({address: autocomplete.getPlace()});
          });
        });
      }
    };
  };
  return mapAutocomplete;
})();

angular.module('svWizardApp').directive( 'mapAutocomplete', [ '$timeout', 
  svWizard.directives.mapAutocomplete]);