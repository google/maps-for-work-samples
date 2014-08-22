genewvectorresource -o Resources/Vector/Names/GeonamesAllCities allCountries.txt
gebuild Resources/Vector/Names/GeonamesAllCities


cat<<EndOfDoc


You just added a resource called Resources/Vector/Names/GeonamesAllCities
It will take a little while to build. Once it is done, you need to run the
following commands to add the data to the vector project:


geaddtovectorproject -o Projects/Vector --template StateNames.khdsp  Resources/Vector/Names/GeonamesAllCities
geaddtovectorproject -o Projects/Vector --template world_cities.khdsp Resources/Vector/Names/GeonamesAllCities


EndOfDoc
