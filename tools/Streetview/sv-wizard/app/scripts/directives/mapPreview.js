var svWizardApp = angular.module('svWizardApp');

svWizardApp.directive( 'mapPreview', ['$timeout', '$window', 'Utils',
  function($timeout, $window, Utils) {
    function initMap_(element) {
      return new google.maps.Map(element.find('div')[0], {
        zoom: 16,
        zoomControl: true,
        scrollwheel: false,
        mapTypeControl: false,
        streetViewControl: true
      });
    }
    return {
      template: '<div style="width:100%;height:100%"></div>',
      scope: {
        map: '=',
        panorama: '='
      },
      link: function(scope, element, attrs) {
        var map = initMap_(element);
        scope.$watch('panorama', function() {
          if(angular.isDefined(scope.panorama) && scope.panorama !== null) {
            map.setStreetView(scope.panorama);
            map.panTo(scope.panorama.getPosition());
            google.maps.event.addListener(scope.panorama,
            'position_changed', function() {
              map.panTo(scope.panorama.getPosition());
            });
          }
        });
      }
    }
  }
]);