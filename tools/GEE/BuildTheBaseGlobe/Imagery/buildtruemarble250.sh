#!/bin/bash
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

blue_base=`pwd`
for file in `find . -name "*.gz"`
do

	base=`basename $file`
	dir=`dirname $file`
	echo "Unzipping $base in $dir"

	cd $dir
	gunzip $base
	cd $blue_base

done
cd $dir
ls *.tif > FileList

echo "Creating Resource Resources/Imagery/BlueMarble250"
genewimageryresource -o Resources/Imagery/BlueMarble250 --flat --nomask --filelist FileList
sleep 2

echo "Building Resource Resources/Imagery/BlueMarble250"
gebuild Resources/Imagery/BlueMarble250

echo "Creating Resource Resources/Imagery/BlueMarbleMercator250"
genewimageryresource -o Resources/Imagery/BlueMarbleMercator250 --mercator --nomask --filelist FileList
sleep 2

echo "Building Resource Resources/Imagery/BlueMarbleMercator250"
gebuild Resources/Imagery/BlueMarbleMercator250

geaddtoimageryproject -o Projects/Imagery Resources/Imagery/BlueMarble250
geaddtoimageryproject -o Projects/Mercator --mercator Resources/Imagery/BlueMarbleMercator250

cd $blue_base
