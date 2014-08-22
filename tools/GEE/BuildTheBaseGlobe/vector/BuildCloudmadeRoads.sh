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

for continent in africa asia europe north_america oceania south_america
do

	find $continent -name "*highway.shp" > ListOfHighways
	genewvectorresource -o Resources/Vector/Roads/OSM/$continent/highway --encoding "ISO 8859-1" --filelist ListOfHighways
	sleep 5
	gebuild Resources/Vector/Roads/OSM/$continent/highway
done

echo "*************************************************************************************"
echo "**"
echo "** once the resources are done building, you can hit return to finish adding OSM Roads"
echo "** Keep an eye on the task manager, or run getop to see the build progress"
echo "  "
echo -n "Hit return when they are finished ->"
read text

for continent in africa asia europe north_america oceania south_america
do
	geaddtovectorproject -o Projects/Vector --template ${continent}_highway.khdsp Resources/Vector/Roads/OSM/$continent/highway
done
