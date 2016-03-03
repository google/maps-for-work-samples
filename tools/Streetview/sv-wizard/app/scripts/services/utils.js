/** @namespace 
*/
var svWizard = svWizard || {};

/**
 * Inserted into angular as factory Utils, with the same structure and
 * functions as listed here.
 * @namespace
*/
svWizard.utils = {
  /**
   * 
   * @namespace */
  numbers: {},
  /** @namespace */
  signing: {},
  /** @namespace */
  ui: {}
};

/**
 * Rounds <tt>num</tt> to have a given number of decimal places
 * @param {number} num The number to round
 * @param {number} places How many decimal places to round to
 * @returns {number}
 */
svWizard.utils.numbers.decimalPlaces = function(num, places) {
  var multiplier = Math.pow(10, places);
  return Math.round( num * multiplier) / multiplier;
};


svWizard.utils.numbers.wrap = function(num,max) {
  if( num >= 0) {
    return num % max;
  }else if( num < 0) {
    return max + num%max;
  }
};
    
svWizard.utils.numbers.fov2zoom = function(fov) {
  //From the documentation: https://goo.gl/hCvvt
  // fov = 180 / (2 ^ zoom)
  // zoom = (log(180) - log(fov))/log(2)
  return Math.log(180/fov) / Math.log(2);
};
    
svWizard.utils.numbers.zoom2fov = function(zoom) {
  return 180 / (Math.pow(2,zoom));
}

svWizard.utils.ui.getInnerSize = function(el, theWindow) {
  var s = theWindow.getComputedStyle(el, null);
  var px2int = svWizard.utils.ui.px2int;
  var tWidth = px2int(s.getPropertyValue('width'));
  var tHeight = px2int(s.getPropertyValue('height'));
  var pRigth = px2int(s.getPropertyValue('padding-right'));
  var pLeft = px2int(s.getPropertyValue('padding-left'));
  var pTop = px2int(s.getPropertyValue('padding-top'));
  var pBottom = px2int(s.getPropertyValue('padding-bottom'));

  return {
    width: tWidth - pRigth - pLeft,
    height: tHeight - pTop - pBottom
  };
}

svWizard.utils.ui.px2int = function(px) {
  return parseInt(px.replace('px', ''));
}

svWizard.utils.signing.signature = function(text, cryptoKey) {
  var unescapedCryptoKey = svWizard.utils.signing.
    unescapeWebSafeBase64(cryptoKey);
  var shaObj = new jsSHA('SHA-1', 'TEXT');
  shaObj.setHMACKey(unescapedCryptoKey, 'B64');
  shaObj.update(text);
  var unescapedSignature = shaObj.getHMAC('B64');
  return svWizard.utils.signing.escapeWebSafeBase64(unescapedSignature);
}
    
svWizard.utils.signing.unescapeWebSafeBase64 = function(escaped) {
  return escaped.replace(/-/g, '+').replace(/_/g, '/');
}
    
svWizard.utils.signing.escapeWebSafeBase64 = function(unescaped) {
  return unescaped.replace(/\+/g, '-').replace(/\//g, '_');
}

angular.module('svWizardApp').factory('Utils', function() {
  return svWizard.utils;
});