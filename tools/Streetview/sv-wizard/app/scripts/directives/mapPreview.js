var svWizard = svWizard || {};
svWizard.directives = svWizard.directives || {};

svWizard.directives.mapPreview = (function(){
  
  /**
   * The mapPreview (map-preview) directive inserts a Google Map into the 
   * view linked to a Street View panorama so it updates its position when the
   * panorama does and also, it changes the panorama location when the pegman
   * is dropped some where.
   * <br/><br/>
   * The following attributes are included in the scope
   * <ul>
   *  <li><b>map</b>: contains the Google Map object created within the 
   *    directive 
   *  </li>
   *  <li><b>panorama</b>: the Street View panorama object to update the 
   *    position 
   *  </li>
   * <ul>
   * @member {Directive} mapPreview
   * @memberOf svWizard.directives
   */
  var mapPreview = function($timeout, $window, Utils) {
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
        /* When the panorama changes, we link it to the map */
        scope.$watch('panorama', function() {
          if(angular.isDefined(scope.panorama) && scope.panorama !== null) {
            map.setStreetView(scope.panorama);
            map.panTo(scope.panorama.getPosition());
            google.maps.event.addListener(scope.panorama,
            'position_changed', function() {
              // Listen to panorama position changes to update the center of the
              // map
              map.panTo(scope.panorama.getPosition());
            });
          }
        });
      }
    }
  }
  return mapPreview;
})();

angular.module('svWizardApp').directive( 'mapPreview', ['$timeout', '$window', 
'Utils', svWizard.directives.mapPreview
]);
