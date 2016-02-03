var svWizard = svWizard || {};

svWizard.utils = {};

svWizard.utils.numbers = (function() {
    var numbers = {};
    numbers.decimalPlaces = function(num, places) {
        var multiplier = Math.pow(10, places);
        return Math.round( num * multiplier) / multiplier;
    };
    
    numbers.wrap = function(num,max) {
        if( num >= 0) {
            return num % max;
        }else if( num < 0) {
            return max + num%max;
        }
    };
    
    //From the documentation: https://goo.gl/hCvvt
    // fov = 180 / (2 ^ zoom)
    // zoom = (log(180) - log(fov))/log(2)
    numbers.fov2zoom = function(fov) {
        return Math.log(180/fov) / Math.log(2);
    };
    
    numbers.zoom2fov = function(zoom) {
        return 180 / (Math.pow(2,zoom));
    }
    return numbers;
})();

svWizard.utils.ui = (function() {
    var ui = {};
    ui.getInnerSize = function(el, theWindow) {
        var s = theWindow.getComputedStyle(el, null);
        var tWidth = ui.px2int(s.getPropertyValue('width'));
        var tHeight = ui.px2int(s.getPropertyValue('height'));
        var pRigth = ui.px2int(s.getPropertyValue('padding-right'));
        var pLeft = ui.px2int(s.getPropertyValue('padding-left'));
        var pTop = ui.px2int(s.getPropertyValue('padding-top'));
        var pBottom = ui.px2int(s.getPropertyValue('padding-bottom'));

        return {
            width: tWidth - pRigth - pLeft,
            height: tHeight - pTop - pBottom
        };
    }
    //Externalize in utils
    ui.px2int = function(px) {
        return parseInt(px.replace('px', ''));
    }
    return ui; 
})();

svWizard.utils.signing = (function() {
    var signing = {};
    signing.signature = function(text, cryptoKey) {
        var unescapedCryptoKey = signing.unescapeWebSafeBase64(cryptoKey);
        console.log(unescapedCryptoKey);
        var key = CryptoJS.enc.Base64.parse(unescapedCryptoKey);
        var hash = CryptoJS.HmacSHA1(text, key);
        var unescapedSignature = hash.toString(CryptoJS.enc.Base64);
        console.log(unescapedSignature);
        return signing.escapeWebSafeBase64(unescapedSignature);
        
    }
    
    signing.unescapeWebSafeBase64 = function(escaped) {
        return escaped.replace(/-/g, '+').replace(/_/g, '/');
    }
    
    signing.escapeWebSafeBase64 = function(unescaped) {
        return unescaped.replace(/\+/g, '-').replace(/\//g, '_');
    }
    return signing;
}());