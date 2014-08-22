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

