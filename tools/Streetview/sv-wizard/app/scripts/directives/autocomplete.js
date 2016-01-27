var svWizardApp = angular.module('svWizardApp');


svWizardApp.directive( 'autocomplete', [ '$timeout', function($timeout) {

  return {
    restrict: 'A',
    scope: {
      autocomplete: '&'
    },
    link: function(scope, element, attrs) {
      var autocomplete = new google.maps.places.Autocomplete(element[0]);
      
      autocomplete.addListener('place_changed', function(){
        scope.$apply();
        $timeout(function() {
          scope.autocomplete({address: autocomplete.getPlace()});
        });
      });
    }
  }
}]);