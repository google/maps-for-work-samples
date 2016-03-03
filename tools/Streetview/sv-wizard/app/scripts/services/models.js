var svWizard = svWizard || {};

angular.module('svWizardApp').factory('M', function() {
  var models = {};
  models.AuthenticationMode = svWizard.AuthenticationMode;
  return models;
});