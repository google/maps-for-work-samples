// Copyright 2014 Google Inc.

/**
 * @author Wolf Bergenheim (Google)
 * @fileoverview
 * Provides access to store data through Google Cloud SQL.
 * Depends on the cloudsql REST API
 *   https://github.com/google/maps-for-work-samples
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A DataFeed where stores are provided by Google Cloud SQL.
 * <p>
 * Note: the App Engine that serves the API needs to be publicly accessible.
 * @example <pre>
 * var dataFeed = new storeLocator.CloudSqlDataFeed({
 *   table: 'medicare',
 *   database: 'medicare',
 *   server: 'http://project-wander-1.appspot.com',
 *   propertiesModifier: function(props) {
 *     return {
 *       id: transformId(props.OGR_FID),
 *       title: props.fcility_nam
 *     };
 *   }
 * });
 * new storeLocator.View(map, dataFeed);
 * </pre>
 * @implements storeLocator.DataFeed
 * @param {!storeLocator.CloudSqlDataFeedOptions} opts the table ID, API key and
 * a transformation function for feature/store properties.
 * @constructor
 * @implements storeLocator_CloudSqlDataFeed
 */
storeLocator.CloudSqlDataFeed = function(opts) {
  this.database_ = opts['database'];
  this.table_ = opts['table'];
  this.server_ = opts['server'];
  if (opts['propertiesModifier']) {
    this.propertiesModifier_ = opts['propertiesModifier'];
  }
};
storeLocator['CloudSqlDataFeed'] = storeLocator.CloudSqlDataFeed;

/**
 * Returns the stores inside the given bounds.
 * @param {google.maps.LatLngBounds} bounds
 * @param {storeLocator.FeatureSet} features the features to filter on.
 * Unused
 * @param {function(Array.<!storeLocator.Store>)} callback the callback
 * function.
 */
storeLocator.CloudSqlDataFeed.prototype.getStores = function(
    bounds, features, callback) {
  // TODO: use features.
  var that = this;
  var center = bounds.getCenter();

  // 0.18 is 20000/111045 which is approximately 20 km expressed in degrees
  var where = '(ST_INTERSECTS(geometry, ' + this.boundsToWkt_(bounds) + ')' +
      ' OR ST_DISTANCE(geometry, ' + this.latLngToWkt_(center) + ') < 0.18)';
  var select = 'uuid,fcilty_nam,fcilty_typ,state,street_add,' +
      'locality,postcode,hrs_of_bus,wheelchair,shp_num_an,shp_centre';
  var encodedIdentifier = encodeURIComponent(this.database_) + ':' +
      encodeURIComponent(this.table_);

  var url = this.server_ + '/tables/' + encodedIdentifier + '/features?';

  $.getJSON(url, {
    'select': select,
    'where': where,
    'limit': 300
  }, function(resp) {
    var stores = that.parse_(resp);
    that.sortByDistance_(center, stores);
    callback(stores);
  });
};

/**
 * @private
 * @param {!google.maps.LatLng} point
 * @return {string}
 */
storeLocator.CloudSqlDataFeed.prototype.latLngToWkt_ = function(point) {
  return "ST_GEOMFROMTEXT('POINT(" + point.lng() + ' ' + point.lat() + ")')";
};

/**
 * @private
 * @param {!google.maps.LatLngBounds} bounds
 * @return {string}
 */
storeLocator.CloudSqlDataFeed.prototype.boundsToWkt_ = function(bounds) {
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  return [
    "ST_GEOMFROMTEXT('POLYGON ((",
    sw.lng(), ' ', sw.lat(), ', ',
    ne.lng(), ' ', sw.lat(), ', ',
    ne.lng(), ' ', ne.lat(), ', ',
    sw.lng(), ' ', ne.lat(), ', ',
    sw.lng(), ' ', sw.lat(),
    "))')"
  ].join('');
};

/**
 * @private
 * @param {*} data GeoJSON feature set.
 * @return {!Array.<!storeLocator.Store>}
 */
storeLocator.CloudSqlDataFeed.prototype.parse_ = function(data) {
  if (data['error']) {
    window.alert(data['error']['message']);
    return [];
  }
  var features = data['features'];
  if (!features) {
    return [];
  }
  var stores = [];
  for (var i = 0, row; row = features[i]; i++) {
    var coordinates = row['geometry']['coordinates'];
    var position = new google.maps.LatLng(coordinates[1], coordinates[0]);

    var props = this.propertiesModifier_(row['properties']);
    var store = new storeLocator.Store(props['id'], position, null, props);
    stores.push(store);
  }
  return stores;
};

/**
 * Default properties modifier. Just returns the same properties passed into
 * it. Useful if the columns in the DB table are already appropriate.
 * @private
 * @param {Object} props
 * @return {Object} an Object to be passed into the "props" argument in the
 * Store constructor.
 */
storeLocator.CloudSqlDataFeed.prototype.propertiesModifier_ = function(props) {
  return props;
};

/**
 * Sorts a list of given stores by distance from a point in ascending order.
 * Directly manipulates the given array (has side effects).
 * @private
 * @param {google.maps.LatLng} latLng the point to sort from.
 * @param {!Array.<!storeLocator.Store>} stores  the stores to sort.
 */
storeLocator.CloudSqlDataFeed.prototype.sortByDistance_ =
    function(latLng, stores) {
      stores.sort(function(a, b) {
        return a.distanceTo(latLng) - b.distanceTo(latLng);
      });
    };

/**
 * @example see storeLocator.CloudSqlDataFeed
 * @interface
 */
storeLocator.CloudSqlDataFeedOptions = function() {};

/**
 * The table name to use.
 * @type string
 */
storeLocator.CloudSqlDataFeedOptions.prototype.table;

/**
 * The database to use
 * @type string
 */
storeLocator.CloudSqlDataFeedOptions.prototype.database;

/**
 * The host name of the server that hosts the Cloud SQL GeoJSON API.
 * @type string
 */
storeLocator.CloudSqlDataFeedOptions.prototype.server;

/**
 * A transformation function. The first argument is the feature's properties.
 * Return an object useful for the <code>"props"</code> argument in the
 * storeLocator.Store constructor. The default properties modifier
 * function passes the feature straight through.
 * <p>
 * Note: storeLocator.CloudSqlDataFeed expects an <code>"id"</code> property.
 * @type ?(function(Object): Object)
 */
storeLocator.CloudSqlDataFeedOptions.prototype.propertiesModifier;
