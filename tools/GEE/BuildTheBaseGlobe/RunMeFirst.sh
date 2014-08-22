#!/bin/sh
# Copyright 2014 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
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

