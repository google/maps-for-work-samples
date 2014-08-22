#!/bin/bash

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
