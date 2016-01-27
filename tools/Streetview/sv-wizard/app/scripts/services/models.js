var svWizard = svWizard || {};

var svWizardApp = angular.module('svWizardApp');

svWizardApp.factory('M', function() {
    var models = {};
    models.AuthenticationMode = svWizard.AuthenticationMode;
    
    return models;
});