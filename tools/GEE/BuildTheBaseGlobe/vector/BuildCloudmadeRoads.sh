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
