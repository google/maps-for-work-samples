#!/bin/bash

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
