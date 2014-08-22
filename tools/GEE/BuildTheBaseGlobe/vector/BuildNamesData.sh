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

genewvectorresource -o Resources/Vector/Names/GeonamesAllCities allCountries.txt
gebuild Resources/Vector/Names/GeonamesAllCities


cat<<EndOfDoc


You just added a resource called Resources/Vector/Names/GeonamesAllCities
It will take a little while to build. Once it is done, you need to run the
following commands to add the data to the vector project:


geaddtovectorproject -o Projects/Vector --template StateNames.khdsp  Resources/Vector/Names/GeonamesAllCities
geaddtovectorproject -o Projects/Vector --template world_cities.khdsp Resources/Vector/Names/GeonamesAllCities


EndOfDoc
