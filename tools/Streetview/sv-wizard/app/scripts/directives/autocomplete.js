var svWizardApp = angular.module('svWizardApp');


svWizardApp.directive( 'mapAutocomplete', [ '$timeout', function($timeout) {

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
  }
}]);