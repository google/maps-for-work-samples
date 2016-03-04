var svWizard = svWizard || {};
svWizard.directives = svWizard.directives || {};

svWizard.directives.svPreview = (function(){
  /**
   * The svPreview (sv-preview) directive element creates a Street View Panorama
   * object in the view, and links the positions and view direction parameters
   * to the ones provided to the scope. That means that changes in the Street 
   * View will be reflected in the provided values and changes in the values 
   * will be reflected into the Street View Panorama.
   * <br/><br/>
   * It exposes the following parameters as attributes
   * <ul>
   *  <li><b>panorama</b>: contains the Google Panorama object created within 
   *    the directive 
   *  </li>
   *  <li><b>location</b>: the LatLng coordinates of the Street View
   *  </li>
   *  <li><b>heading</b>: the heading value of the Street View
   *  </li>
   *  <li><b>pitch</b>: the pitch value of the Street View
   *  </li>
   *  <li><b>fov</b>: the fov value of the Street View
   *  </li>
   *  <li><b>size</b>: the size of the request. It will be used to calculate the
   *    aspect ratio of the request and use the same one to display the Street
   *    View.
   *  </li>
   * <ul>
   * @member {Directive} svPreview
   * @memberOf svWizard.directives
   */
  var svPreview = function($timeout, $window, Utils) {

    //Event listener creators
    function zoomListener_(scope, panorama) {
      return function() {
        $timeout(function(){
          var fov = Utils.numbers.zoom2fov(panorama.getZoom());
          //FOV cannot be > 120 in the Street View API
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
          // Wrap the heading value to 360, as per the Street View API
          // specs
          // Also, use only one decimal in the numbers, as mnore precission is
          // unoticeable
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
          // Use only 5 decimal places, as more precission is unnoticeable
          scope.location.lat = Utils.numbers.decimalPlaces(
            position.lat(),5);
          scope.location.lng = Utils.numbers.decimalPlaces(
            position.lng(), 5);
          panorama.setVisible(true);
        });
      };
    }
    
    // It resizes the panorama object to match the ratio width/height of the
    // request size.
    function resizePanorama_(scope, parent, panoramaEl, panorama) {
      var parentSize = Utils.ui.getInnerSize(parent, 
        $window.getComputedStyle(parent, null));
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
        //Create Listeners
        var zoomListener = zoomListener_(scope, panorama);
        var povListener = povListener_(scope, panorama);
        var positionListener = positionListener_(scope, panorama);
        
        //Register listeners
        var zoomListenerId = google.maps.event.addListener(panorama,
          'zoom_changed', zoomListener);
        var povListenerId = google.maps.event.addListener(panorama,
          'pov_changed', povListener);
        var positionListenerId = google.maps.event.addListener(panorama,
          'position_changed', positionListener);
        
        /*Listen for changes on the parameters of the scope.
          The listeners of their respective are removed before setting the new
          value to prevent an endless bucle of events
        */
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
        
        // Resize the panorama to match the size ratio
        resizePanorama_(scope, container, panoramaEl, panorama);
        
        // Resize the panorama everytime the container is resized
        angular.element($window).bind('resize', function() {
          resizePanorama_(scope, container, panoramaEl, panorama);
        });
      }
    };
  };
  
  return svPreview;
})();
   
angular.module('svWizardApp').directive( 'svPreview', ['$timeout', '$window', 'Utils',
  svWizard.directives.svPreview
]);
