# Copyright 2014 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""A light REST API to query the backed data.

This is not production-quality software, but intended as a proof-of-concept.
This is intentionally mimiking the Google Maps Engine API.
Currently supports only the Tables.features list operation at url:
/tables/{db}:{table}/features

Supports the following path parameters:
* id

Supports the following query parameters:
* limit
* orderBy
* select
* where

All other query arameters are ignored.
"""

import json
import logging
import os
import traceback
import MySQLdb

# flask, jeojson and geomet are external dependencies.
# Install them by running pip install -r requirements.txt -t lib
import flask
import geojson
from geomet import wkt
import sqlparse

# This is your CloudSQL instance
_INSTANCE = 'project-wander-1:demo-sql'
# This is the host to connect to in the dev server.
# This can be the IP address of your CloudSQL server, if you want to test that.
_MYSQL_HOST = '127.0.0.1'
_MYSQL_USER = 'root'
_MYSQL_PASSWORD = 'changeme'

# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.
app = flask.Flask(__name__)


@app.route('/tables/<database>:<table>/features')
def features_list(database, table):
    """Handle the parsing of the request and return the geojson.

    This routes all the API requests to the handler.
    See http://flask.pocoo.org/docs/0.10/api/#flask.Flask.route

    Args:
      database: The name of the database to use, this is picked from the URL.
      table: The database table to query from, this is picked from the URL.
    Returns:
      A flask.Response object with the GeoJSON to be returned, or an error JSON.
    """
    where = flask.request.args.get('where', default='true')
    select = flask.request.args.get('select', default='')
    limit = flask.request.args.get('limit')
    order_by = flask.request.args.get('orderBy')
    try:
      f = Features(_INSTANCE, database)
    except MySQLdb.OperationalError as e:
      error = {'error': 'Database Error %s' % str(e)}
      return flask.Response(response=json.dumps(error),
                            mimetype='application/json',
                            status=500)


    feature_collection = f.list(table, select, where,
                                limit=limit, order_by=order_by)
    if 'error' in feature_collection:
        return flask.Response(response=json.dumps(feature_collection),
                              mimetype='application/json',
                              status=500)
    else:
        return flask.Response(
            response=geojson.dumps(feature_collection, sort_keys=True),
            mimetype='application/json',
            status=200)


@app.errorhandler(404)
def page_not_found(_):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def internal_error(_):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(traceback.format_exc()), 500


class Features(object):
    """Implements the tables endpoint in the REST API.

    This class handles all tables/{db}:{table}/features requests.
    """

    def __init__(self, instance, database):
        """Set up a database connection to the cloud SQL server."""
        # Keep track of the db instance.
        self._instance = instance
        # The name of the database to use.
        self._database = database
        self._connect()

    def _connect(self):
        if (os.getenv('SERVER_SOFTWARE') and
            os.getenv('SERVER_SOFTWARE').startswith('Google App Engine/')):
            socket_name = '/cloudsql/%s' % self._instance
            self._db = MySQLdb.connect(unix_socket=socket_name,
                                       db=self._database, user='root')
        else:
            self._db = MySQLdb.connect(host=_MYSQL_HOST, port=3306,
                                       db=self._database, user=_MYSQL_USER,
                                       passwd=_MYSQL_PASSWORD)

    def __del__(self):
        self._db.close()

    # TODO: Add more methods for Create/Update/Delete features, and tables.
    def list(self, table, select, where, limit=None, order_by=None):
        """Send the query to the database and return the result as GeoJSON.

        Args:
          table: The Table to use.
          select: A comma-separated list of columns to use. Anything that is
              valid SQL is accepted. This value needs rigorous error checking.
          where: A valid SQL where statement. Also needs a lot of checking.
          limit: The limit the number of returned entries.
          order_by: A valid SQL order by statement.

        Returns:
          A GeoJSON FeatureCollection representing the returned features, or
              a dict explaining the error.
        """

        cursor = self._db.cursor()
        features = []
        cols = []
        # Add the geometry column to the query. This assumes that geometry is
        # not in the selected columns.
        if select:
            select = '%s,AsWKT(geometry) as wktgeom' % select
        else:
            select = 'AsWKT(geometry) as wktgeom'

        # Build the query.
        query = ['select %(select)s from %(id)s where %(where)s' % {
            'id': table,
            'select': select,
            'where': where
        }]
        if order_by:
            query.append('order by %s' % order_by)
        if limit:
            query.append('limit %s' % limit)


        # Convert the list to a string.
        query_string = ' '.join(query)
        logging.info('query = "%s"', query_string)
        if len(sqlparse.split(query_string)) > 1:
          return {'error': 'invalid parameter'}
        rows = []
        try:
            cursor.execute(' '.join(query))
            cols = [i[0] for i in cursor.description]
            rows = cursor.fetchall()
        except MySQLdb.Error as e:
            # This error should probably be made better in a production system.
            return {'error': 'Something went wrong: {}'.format(e)}

        # Give each feature a unique ID.
        feature_id = 0
        # now we read the rows and generate geojson out of them.
        for row in rows:
            wktgeom = row[-1]
            props = dict(zip(cols[:-1], row[:-1]))
            # wkt.loads returns a dict which corresponds to the geometry
            # We dump this as a string, and let geojson parse it
            geom = geojson.loads(json.dumps(wkt.loads(wktgeom)))
            # Turn the geojson geometry into a proper GeoJSON feature
            feature = geojson.Feature(geometry=geom, properties=props,
                                      id=feature_id)
            feature_id += 1
            # Add the feature to our list of features.
            features.append(feature)
        # Close the cursor, now that we are done with it.
        cursor.close()
        # Return the list of features as a FeatureCollection.
        return geojson.FeatureCollection(features)
