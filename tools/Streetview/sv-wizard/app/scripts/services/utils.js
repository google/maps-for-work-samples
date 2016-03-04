
var svWizard = svWizard || {};

svWizard.services = svWizard.services || {};

/**
 * This namespace contains utility functions to work with UI, numbers
 * and signing algorithms.
 * <br/>
 * It is included in the angular app module as <b>Utils</b> factory and needs 
 * no configuration
 * @namespace
*/
svWizard.services.utils = (function(){
  
  /** @lends svWizard.services.utils */
  var utils = {
    /**
     * Utility functions to format and transform numbers
     * @namespace
     */
    numbers: {},
    /**
     * Utility functions to sign strings
     * @namespace
     */
    signing: {},
    /**
     * Utility functions to use for UI operations
     * @namespace
     */
    ui: {},
    
    /**
     * Utility functions to generate the request URL out of the
     * request parameters and configuration
     * @namespace
     */
    generator: {}
  };
  
  /**
   * Rounds <tt>num</tt> to have a given number of decimal places
   * @param {number} num number to round
   * @param {number} places number of decimal places to round to
   * @returns {number}
   * @memberOf svWizard.services.utils.numbers
   */
   
  utils.numbers.decimalPlaces = function(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round( num * multiplier) / multiplier;
  };
  
  /**
   * Makes the number to be always between 0 and <tt>max</tt> by wrapping it 
   * to the other side. If a number is goes over the maximum value, it is
   * wrapped to 0. If it goes under 0, it is wrapped to the maximum.
   * 
   * @param {number} num number to wrap
   * @param {number} max maximum value allowed
   * @returns {number}
   * @memberOf svWizard.services.utils.numbers
   */ 
  utils.numbers.wrap = function(num,max) {
    if( num >= 0) {
      return num % max;
    }else if( num < 0) {
      return max + num%max;
    }
  };
  
  /**
   * Converts the FoV (Field of View) value of a Google Maps Street View API
   * request to a zoom level required by the Street View in the Javascript API,
   * as per the documentation here: https://goo.gl/hCvvt
   * @param {number} fov field of view value in degrees
   * @returns {number} corresponding zoom value
   * @memberOf svWizard.services.utils.numbers
   */
  utils.numbers.fov2zoom = function(fov) {
    // fov = 180 / (2 ^ zoom)
    // zoom = (log(180) - log(fov))/log(2)
    return Math.log(180/fov) / Math.log(2);
  };
  /**
   * Converts the zoom level required by the Street View in the Javascript API
   * to the FoV (Field of View) value of a Google Maps Street View API
   * request to as per the documentation here: https://goo.gl/hCvvt
   * @param {number} zoom
   * @returns {number} corresponding field of view value in degrees
   * @memberOf svWizard.services.utils.numbers
   */   
  utils.numbers.zoom2fov = function(zoom) {
    return 180 / (Math.pow(2,zoom));
  }
  
  /**
   * Calculates the available inner size of the element in pixels, by 
   * substracting the padding values to the dimensions (width and height)
   * @param {Element} element HTML element to obtain the inner size from
   * @param {CSSStyleDeclaration} cs the computed style of the element
   * @returns {number} the inner size of the element in pixels
   * @memberOf svWizard.services.utils.ui
   */
  utils.ui.getInnerSize = function(el, cs) {
    var px2int = utils.ui.px2int;
    var tWidth = px2int(cs.getPropertyValue('width'));
    var tHeight = px2int(cs.getPropertyValue('height'));
    var pRigth = px2int(cs.getPropertyValue('padding-right'));
    var pLeft = px2int(cs.getPropertyValue('padding-left'));
    var pTop = px2int(cs.getPropertyValue('padding-top'));
    var pBottom = px2int(cs.getPropertyValue('padding-bottom'));
  
    return {
      width: tWidth - pRigth - pLeft,
      height: tHeight - pTop - pBottom
    };
  }
  
  /**
   * Helper function to convert a CSS string value of pixels, such as 
   * <tt>'12px'</tt> to its number value.
   * @param {String} px CSS string value of a pixel measure
   * @returns {number} pixel value
   * @memberOf svWizard.services.utils.ui
   */
  utils.ui.px2int = function(px) {
    return parseInt(px.replace('px', ''));
  }
  
  /**
   * Generates a signature for a string with a crypto key using the 
   * HMAC-SHA1 algorithm (https://goo.gl/wj9NNv)
   * @param {String} text to generate the signature from
   * @param {String} cryptoKey Base64 WebSafe encoded HMAC secret used to generate
   *  the signature
   * @returns {string} generated Base64 WebSafe encoded signature
   * @memberOf svWizard.services.utils.signing
   */
  utils.signing.signature = function(text, cryptoKey) {
    var unescapedCryptoKey = utils.signing.unescapeWebSafeBase64(cryptoKey);
    var shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.setHMACKey(unescapedCryptoKey, 'B64');
    shaObj.update(text);
    var unescapedSignature = shaObj.getHMAC('B64');
    return utils.signing.escapeWebSafeBase64(unescapedSignature);
  }
   /**
   * Removes the safe characters used in the modified Base64 string input and
   * returns a string with valid Base64 characters. It replaces <tt>-</tt> by
   * <tt>+</tt> and <tt>_</tt> byt <tt>/</tt>
   * @param {String} escaped Websafe escaped Base64
   * @returns {string} regular Base64
   * @memberOf svWizard.services.utils.signing
   */    
  utils.signing.unescapeWebSafeBase64 = function(escaped) {
    return escaped.replace(/-/g, '+').replace(/_/g, '/');
  }
  /**
   * Removes the web unsafe characters used a Base64 string input and
   * returns a Base64 string with web safe characters. It replaces <tt>+</tt> by
   * <tt>-</tt> and <tt>/</tt> byt <tt>_</tt>
   * @param {string} unescaped regular Base64
   * @returns {string} websafe escaped Base64
   * @memberOf svWizard.services.utils.signing
   */      
  utils.signing.escapeWebSafeBase64 = function(unescaped) {
    return unescaped.replace(/\+/g, '-').replace(/\//g, '_');
  }

  /**
   * Generates a request URL for a given request parameters and authentication
   * credentials
   * @param {svWizard.models.Request} request contains the parameters to build
   *  the URL
   * @param {svWizard.services.Settings} settings application settings to get 
   *  the configuration credentials from
   * @returns {string}
   * @memberOf svWizard.services.utils.generator
   */ 
  utils.generator.generate = function(request, settings) {
    var parameters = {
      location: request.location.lat + ',' + request.location.lng,
      heading: request.heading,
      pitch: request.pitch,
      fov: request.fov,
      size: request.size.width + 'x' + request.size.height
    };
    var relativeUrl = utils.generator.addParameters(svWizard.BASE_URL, parameters);
        
    if(request.authenticationMode == svWizard.models.AuthenticationMode.NONE) {
      return svWizard.DOMAIN + relativeUrl;
    }else if(request.authenticationMode == svWizard.models.AuthenticationMode.API_KEY){
      return svWizard.DOMAIN + relativeUrl + '&key=' + settings.apiKey;
    }else{
      var urlToSign = relativeUrl + '&client=' + settings.clientId;
      var signature = utils.signing.signature(urlToSign, 
        settings.cryptoKey);
      return svWizard.DOMAIN + urlToSign + '&signature=' + signature;
    }
  };
  
  /**
   * Appends query parameters to a given URL path
   * @param {string} path URL path to add the parameters to
   * @param {Object} parameters key-value pairs where the key is the parameter
   *  name and the value its content
   * @returns {string} the URL with the query parameters
   * @memberOf svWizard.services.utils.generator
   */
  utils.generator.addParameters = function (path,parameters) {
    var url = path;
    var paramStr = '';
    for (var key in parameters) {
      if(parameters.hasOwnProperty(key)) {
        paramStr += key + '=' + parameters[key];
        paramStr += '&';
      }
    }
    if(paramStr.length > 0) {
      paramStr = paramStr.slice(0, paramStr.length - 1);
      url += '?' + paramStr;
    }
    return url;
  }  
  return utils;
})();

angular.module('svWizardApp').factory('Utils', function() {
  return svWizard.services.utils;
});