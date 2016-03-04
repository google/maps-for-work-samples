var svWizard = svWizard || {};
var angular = angular || {};

svWizard.services = svWizard.services || {};

svWizard.services.State = (function(){
  
  /**
   * The State service is used to store and retrieve the status of the
   * application using the browser's local storage.
   * <br/><br/>
   * It is included in the angular app module as <b>State</b> service and needs 
   * no configuration
   * @constructor
   * @param {localStorageService} localStorageService <b>Injected</b>
   * @memberOf svWizard.services
   */  
  var State = function(localStorageService) {
    
    var CURRENT = 'current';
    var current_ = {};
    
    //Get value from local storage
    init_();

    /**
     * Current request being edited on the app. When the request is changed
     * by setting its value to a new one, it will be automatically updated in
     * local storage. Note that it won't react when the properties of the
     * object change.
     * @member {Request} current
     * @memberOf svWizard.services.State.prototype
     */
    Object.defineProperty(this, 'current', {
      get: function(){
        if(angular.isUndefined(current_.size) ||
        angular.isUndefined(current_.location) ||
        angular.isUndefined(current_.heading) ||
        angular.isUndefined(current_.fov) ||
        angular.isUndefined(current_.pitch)) {
          current_ = angular.copy(State.DEFAULT_REQUEST);
        }
        return current_;
      },
      set: function(request){
        current_ = request;
        this.saveCurrentRequest();
      }
    });
    
    /**
     * Saves <tt>current</tt> request in local storage. Should be call everytime
     * its properties change.
     * @method saveCurrentRequest
     * @memberOf svWizard.services.State.prototype
     */
    this.saveCurrentRequest = function(){
      var currentJson = angular.toJson(current_);
      localStorageService.set(CURRENT, currentJson);
    }
    
    //Private
    
    /* It gets the current resquest data from local storage */
    function init_() {
      var rawCurrent = localStorageService.get(CURRENT);
      if(angular.isDefined(rawCurrent) && rawCurrent !== null &&
        rawCurrent.length > 0) {
        current_ = angular.fromJson(rawCurrent);
      }else{
        current_ = {};
      }
    }

  }
  
  /**
   * @constant
   * @type {svWizard.models.Request}
   */
  State.DEFAULT_REQUEST =  {
    timestamp: null,
    name: null,
    location: {lat: 37.3863, lng: -5.99205},
    size: {
      width: 640,
      height: 640
    },
    heading: 254.5,
    fov: 71.6,
    pitch: 30.8,
    authenticationMode: svWizard.models.AuthenticationMode.NONE
  };
  
  return State;
})();

angular.module('svWizardApp').service('State', ['localStorageService',
  svWizard.services.State
]);
