var svWizardApp = angular.module('svWizardApp');

svWizardApp.directive( 'svPreview', ['$timeout', '$window', 'Utils',
  function($timeout, $window, Utils) {

    function zoomListener_(scope, panorama) {
      return function() {
        $timeout(function(){
          var fov = Utils.numbers.zoom2fov(panorama.getZoom());
          //FOV cannot be > 120 for SV API
          if( fov > 120) {
            panorama.setZoom(Utils.numbers.fov2zoom(120));
          }else{
            scope.fov = Utils.numbers.decimalPlaces(fov,1);
          }
        });
      };
    }
    
    function povListener_(scope, panorama) {
      return function() {
        var pov = panorama.getPov();
        $timeout(function(){
          scope.heading = Utils.numbers.decimalPlaces(
            Utils.numbers.wrap(pov.heading, 360), 1);
          scope.pitch =  Utils.numbers.decimalPlaces(pov.pitch, 1);
        });
      };
    }
    
    function positionListener_(scope, panorama) {
      return function() {
        $timeout(function(){ 
          var position = panorama.getPosition();
          scope.location.lat = Utils.numbers.decimalPlaces(
            position.lat(),5);
          scope.location.lng = Utils.numbers.decimalPlaces(
            position.lng(), 5);
          panorama.setVisible(true);
        });
      };
    }
    
    function resizePanorama_(scope, parent, panoramaEl, panorama) {
      var parentSize = Utils.ui.getInnerSize(parent, $window);
      var pRatio = parentSize.width / parentSize.height;
      var ratio = scope.size.width / scope.size.height;
      if(pRatio > ratio) {
        panoramaEl.style.height = '100%';
        panoramaEl.style.width = ratio/pRatio * 100 + '%';
      }else{
        panoramaEl.style.width = '100%';
        panoramaEl.style.height = pRatio/ratio * 100 + '%';
      }
      // The event has to be manually triggered because if not, the panorama
      // view doesn't notice the size changed
      google.maps.event.trigger(panorama, 'resize');
    }

    return {
      restrict: 'E',
      scope: {
        panorama: '=',
        location: '=',
        heading: '=',
        pitch: '=',
        fov: '=',
        size: '='
      },
      templateUrl: 'templates/sv-unavailable.html',
      link: function(scope, element, attrs) {
        // Enable IV
        window['google']['maps']['streetViewViewer'] = 'photosphere';
        var panoramaEl = element[0];
        var container = element.parent()[0];
        
        var panorama = new google.maps.StreetViewPanorama(
          panoramaEl,
          {
            addressControl: false,
            zoomControl: false
          }
        );
        
        scope.panorama = panorama;
        var zoomListener = zoomListener_(scope, panorama);
        var povListener = povListener_(scope, panorama);
        var positionListener = positionListener_(scope, panorama);
        
        var zoomListenerId = google.maps.event.addListener(panorama,
          'zoom_changed', zoomListener);
        var povListenerId = google.maps.event.addListener(panorama,
          'pov_changed', povListener);
        var positionListenerId = google.maps.event.addListener(panorama,
          'position_changed', positionListener);
        
        /* Listen for changes on the parameters.*/
        scope.$watch( 'location', function() {
          google.maps.event.removeListener(positionListenerId);
          var latLng = new google.maps.LatLng(scope.location);
          panorama.setPosition(latLng);
          positionListenerId = google.maps.event.addListener(panorama,
            'position_changed', positionListener);
        }, true);
         
        scope.$watchGroup(['heading', 'pitch'], function(){
          google.maps.event.removeListener(povListenerId);
          panorama.setPov({
            heading: scope.heading,
            pitch: scope.pitch
          });
          povListenerId = google.maps.event.addListener(panorama,
            'pov_changed', povListener);
        });
        
        scope.$watch('size', function(){
          resizePanorama_(scope, container, panoramaEl, panorama);
        }, true);

        scope.$watch( 'fov', function() {
          google.maps.event.removeListener(zoomListenerId);
          var fov = scope.fov;
          var zoom = Utils.numbers.fov2zoom(fov);
          panorama.setZoom(zoom);
          zoomListenerId = google.maps.event.addListener(panorama,
            'zoom_changed', zoomListener);
        });
        
        resizePanorama_(scope, container, panoramaEl, panorama);
        
        angular.element($window).bind('resize', function() {
          resizePanorama_(scope, container, panoramaEl, panorama);
        });
      }
    };
  }
]);
