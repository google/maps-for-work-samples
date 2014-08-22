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

wget http://thematicmapping.org/downloads/TM_WORLD_BORDERS-0.3.zip
wget http://dds.cr.usgs.gov/pub/data/nationalatlas/statesp020.tar.gz
wget http://www.ngdc.noaa.gov/mgg/shorelines/data/gshhs/version2.0/shapefiles/gshhs_shp_2.0.zip

tar zxvf statesp020.tar.gz
unzip TM_WORLD_BORDERS-0.3.zip
unzip gshhs_shp_2.0.zip
