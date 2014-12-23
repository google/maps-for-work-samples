var map = null;
var marker = null;
var infowindow = new google.maps.InfoWindow();
var latlng = null;
var activePolygons = [];
// This helper library makes it easy to call the AppEngine application
var cloudSqlApi = new google.cloudsql.CloudSqlJsonApi('nyc');

/**
 * Initializes the map and sets up a click handler that will call CLoudSQL.
 */
function initialize() {
  var mapOptions = {
    center: { lat: 40.68, lng: -74.0273},
    zoom: 11
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Adds a listener to the map click event.
  google.maps.event.addListener(map, 'click', function(event) {
    infowindow.close();
    placeMarker(event.latLng);
    latlng = event.latLng;
    var lat = latlng.lat();
    var lng = latlng.lng();

    // Get the polygon that contains the clicked point.
    cloudSqlApi.pointInPolygon('nyczones', 'zone',
                               latlng, function(geojson) {
      if (geojson.features.length == 0) {
        alert('Point is not in Polygon in CloudSQL Database');
        return;
      }
      map.data.forEach(function(feature) {
        map.data.remove(feature);
      });

      var features = map.data.addGeoJson(geojson);
      map.data.addListener('click', handlePolygonClick);

      activePolygons = [];
      for (i in features) {
        activePolygons.push(features[i].getId());
      }
      map.data.setStyle(function(feature) {
        var color = 'black';
        var clickable = false;
        if ($.inArray(feature.getId(), activePolygons) > -1) {
          color = 'blue';
          clickable = true;
        }
        return {
          fillColor: color,
          strokeColor: color,
          fillOpacity: 0.2,
          clickable: clickable
        };
      });
    });
  });
}

/**
 * Creates a new marker at the given point and removes the old one.
 * @param {google.maps.LatLng} location The location to place the marker on.
 */
function placeMarker(location) {
  if (marker) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: location,
    map: map
  });
}

/**
 * Open an infowindow on the clicked polygon, on the marker.
 * @param {google.maps.Data.MouseEvent} event The click event.
 */
function handlePolygonClick(event) {
  console.log('polygon was clicked');
  var content = $('<p>');
  $('<strong>').text('Properties').appendTo(content);
  content.append('<br>');
  event.feature.forEachProperty(function(v, k) {
    content.append('<strong>' + k + '</strong>: ' + v).append('<br>');
  });

  infowindow.setContent(content.html());
  infowindow.setPosition(latlng);
  infowindow.open(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
