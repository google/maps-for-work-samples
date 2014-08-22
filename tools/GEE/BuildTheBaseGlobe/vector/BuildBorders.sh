#!/bin/sh

echo "Creating Resources/Vector/Borders/StateBorders"
echo "Creating Resources/Vector/Borders/InternationalBorders"
echo "Creating Resources/Vector/Borders/LowRezShoreline"
echo "Creating Resources/Vector/Borders/HiRezShoreline"

genewvectorresource -o Resources/Vector/Borders/StateBorders statesp020.shp
genewvectorresource -o Resources/Vector/Borders/InternationalBorders TM_WORLD_BORDERS-0.3.shp
genewvectorresource -o Resources/Vector/Borders/LowRezShoreline GSHHS_shp/l/GSHHS_l_L1.shp GSHHS_shp/l/GSHHS_l_L2.shp 
genewvectorresource -o Resources/Vector/Borders/HiRezShoreline GSHHS_shp/h/GSHHS_h_L1.shp GSHHS_shp/h/GSHHS_h_L2.shp 

gebuild Resources/Vector/Borders/StateBorders
gebuild Resources/Vector/Borders/InternationalBorders
gebuild Resources/Vector/Borders/LowRezShoreline
gebuild Resources/Vector/Borders/HiRezShoreline

cat<<EndOfDoc


You have added the following resources and they are building:

    Resources/Vector/Borders/StateBorders
    Resources/Vector/Borders/InternationalBorders
    Resources/Vector/Borders/LowRezShoreline
    Resources/Vector/Borders/HiRezShoreline

Once they are done building, you will need to run the following commands:

geaddtovectorproject -o Projects/Vector --template InternationalBorders.khdsp Resources/Vector/Borders/InternationalBorders
geaddtovectorproject -o Projects/Vector --template StateBorders.khdsp  Resources/Vector/Borders/StateBorders
geaddtovectorproject -o Projects/Vector --template LowRezShoreline.khdsp Resources/Vector/Borders/LowRezShoreline
geaddtovectorproject -o Projects/Vector --template HiRezShoreline.khdsp Resources/Vector/Borders/HiRezShoreline


EndOfDoc
