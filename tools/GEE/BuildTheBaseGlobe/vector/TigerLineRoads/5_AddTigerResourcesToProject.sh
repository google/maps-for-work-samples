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

for USState in ALABAMA ALASKA ARIZONA ARKANSAS CALIFORNIA COLORADO CONNECTICUT DELAWARE DISTRICT_OF_COLUMBIA FLORIDA GEORGIA HAWAII IDAHO ILLINOIS INDIANA IOWA KANSAS KENTUCKY LOUISIANA MAINE MARYLAND MASSACHUSETTS MICHIGAN MINNESOTA MISSISSIPPI MISSOURI MONTANA NEBRASKA NEVADA NEW_HAMPSHIRE NEW_JERSEY NEW_MEXICO NEW_YORK NORTH_CAROLINA NORTH_DAKOTA OHIO OKLAHOMA OREGON PENNSYLVANIA RHODE_ISLAND SOUTH_CAROLINA SOUTH_DAKOTA TENNESSEE TEXAS UTAH VERMONT VIRGINIA WASHINGTON WEST_VIRGINIA 
do

      geaddtovectorproject -o Projects/Vector --template $USState.khdsp Resources/Vector/Roads/TigerLine2009/$USState

done





