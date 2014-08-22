#!/bin/sh
#
# This script is part of the larger effort to build a base globe using Google Earth Enterprise
# This script in particular creates empty databases and projects that will be used later. 
# It should be run first, before the other scripts are run. Alternately, the Fusion GUI can be
# used to create these projects and databases. 
#
#
# This script will create the projects and the database. They
# will be empty but the subsequent resources will be added
# to them.
#
#

genewimageryproject -o Projects/Imagery
genewvectorproject  -o Projects/Vector
genewterrainproject -o Projects/Terrain
genewmapproject     -o Projects/Map
genewimageryproject -o Projects/Mercator --mercator

genewdatabase    -o Databases/GoogleEarth --imagery Projects/Imagery --vector Projects/Vector --terrain Projects/Terrain
genewmapdatabase -o Databases/GoogleMap   --imagery Projects/Imagery  --map Projects/Map
genewmapdatabase -o Databases/GoogleMap   --imagery Projects/Mercator --map Projects/Map --mercator

