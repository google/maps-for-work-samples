var svWizardApp = angular.module('svWizardApp');


svWizardApp.directive( 'mapPreview', ['$timeout', '$window', 'Utils',
  function($timeout, $window, Utils) {
    function initMap_(element) {
      return new google.maps.Map(element.find('div')[0], {
          center: {lat: 37.3863, lng: -5.99205},
          zoom: 16,
          zoomControl: false,
          mapTypeControl: false
        });
    }
    return {
      template: '<div style="width:100%,height:100%" id="map"></div>',
      scope: {
        map: '=',
        panorama: '='
      },
      link: function(scope, element, attrs) {
        window.element = element;
        
        var map = initMap_(element);
        
        scope.$watch('panorama', function() {
          map.setStreetView(scope.panorama);
          google.maps.event.addListener(scope.panorama,
                'position_changed', function() {
                  map.panTo(scope.panorama.getPosition());
                });
        })
        
      }
    }
  }]);