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

# Unzip all of the Tiger 2009 files that were just downloaded

find . -name "*edges.zip" > edges_list

home=`pwd`

for file in `cat edges_list`
do

	dir=`dirname $file`
	fname=`basename $file`
	cd $dir
	unzip $fname
	cd $home
done

