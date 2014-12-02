// Create a namespace
var google = google || {};
google.cloudsql = google.cloidsql || {};

/**
 * A helper class to simply calling a CloudSQL REST API.
 * @param {string} database The name of the database to use.
 * @constructor
 */
google.cloudsql.CloudSqlJsonApi = function(database) {
  this.database = database;
  this.featuresCallbacks = $.Callbacks();
  this.pipCallbacks = $.Callbacks();
};

/**
 * Get features from CloudSQL that match the query parameters.
 * @param {string} table The table that stores the features to query for.
 * @param {Object} args An object with additional fields, these are converted to
 *     query parameters in the request.
 * @param {{function(Object)}} callback This function is called when the server
 *     responds, and given the response.
 */
google.cloudsql.CloudSqlJsonApi.prototype.FeaturesList = function(
    table, args, callback) {
  var encoded_args = $.param(args);
  this.FeaturesCallbacks.add(callback);
  var self = this;
  var url = '/tables/' + this.database + ':' + table + '/features?' +
      encoded_args;
  $.getJSON(url, function(response) {
    self.featuresCallbacks.fire(response);
    self.featuresCallbacks.remove(callback);
  })
  .fail(function(jqXHR, errorJson) {
    alert(errorJson.error);
  });
};

/**
 * Get features from CloudSQL that intersect with the given coordinate.
 * @param {string} table The table that stores the features to query for.
 * @param {string} select A MySQL select statement that is passed to the server.
 * @param {google.maps.LatLng} location The query point as a google.maps.LatLng
 * @param {{function(Object)}} callback This function is called when the server
 *     responds, and given the response.
 */
google.cloudsql.CloudSqlJsonApi.prototype.PiP = function(
    table, select, location, callback) {
  var args = {
    lat: location.lat(),
    lng: location.lng(),
    select: select
  };
  var encoded_args = $.param(args);
  this.pipCallbacks.add(callback);
  var self = this;
  var url = '/pip/' + this.database + ':' + table + '?' + encoded_args;
  $.getJSON(url, function(response) {
    self.pipCallbacks.fire(response);
    self.pipCallbacks.remove(callback);
  })
  .fail(function(jqXHR, errorJson) {
    alert(errorJson.error);
  });
};
