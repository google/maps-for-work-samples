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

ls *.jpg > FileList

echo "Creating Resource Resources/Imagery/BlueMarble"
genewimageryresource -o Resources/Imagery/BlueMarble --flat --nomask --filelist FileList
sleep 2

echo "Building Resource Resources/Imagery/BlueMarble"
gebuild Resources/Imagery/BlueMarble

echo "Creating Resource Resources/Imagery/BlueMarbleMercator"
genewimageryresource -o Resources/Imagery/BlueMarbleMercator --mercator --nomask --filelist FileList
sleep 2

echo "Building Resource Resources/Imagery/BlueMarbleMercator"
gebuild Resources/Imagery/BlueMarbleMercator

geaddtoimageryproject -o Projects/Imagery Resources/Imagery/BlueMarble
geaddtoimageryproject -o Projects/Mercator --mercator Resources/Imagery/BlueMarbleMercator
