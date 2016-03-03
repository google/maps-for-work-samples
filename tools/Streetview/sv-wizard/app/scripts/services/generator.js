var svWizard = svWizard || {};

svWizard.generator = {};
svWizard.DOMAIN = 'https://maps.googleapis.com';
svWizard.BASE_URL = '/maps/api/streetview';

svWizard.generator.generate = function(request, settings) {
    
  var parameters = {
    location: request.location.lat + ',' + request.location.lng,
    heading: request.heading,
    pitch: request.pitch,
    fov: request.fov,
    size: request.size.width + 'x' + request.size.height
  };
  var relativeUrl = svWizard.generator.
    addParameters(svWizard.BASE_URL, parameters);
      
  if(request.authenticationMode == svWizard.AuthenticationMode.NONE) {
    return svWizard.DOMAIN + relativeUrl;
  }else if(request.authenticationMode == svWizard.AuthenticationMode.API_KEY){
    return svWizard.DOMAIN + relativeUrl + '&key=' + settings.apiKey;
  }else{
    var urlToSign = relativeUrl + '&client=' + settings.clientId;
    var signature = svWizard.utils.signing.signature(urlToSign, 
      settings.cryptoKey);
    return svWizard.DOMAIN + urlToSign + '&signature=' + signature;
  }
};

svWizard.generator.addParameters = function (path,parameters) {
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

angular.module('svWizardApp').factory('Generator', function() {
  return svWizard.generator;
});