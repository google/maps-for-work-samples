

for file in `find . -name "*.zip"`
do

	base=`basename $file`
	dir=`dirname $file`
	echo "Unzipping $base in $dir"

	cd /gevol/src1/Cloudmade_OSM/south_america
	cd $dir
	unzip $base


done
