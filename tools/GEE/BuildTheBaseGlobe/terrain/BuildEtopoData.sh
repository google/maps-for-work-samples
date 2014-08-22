genewterrainresource -o Resources/Terrain/ETOPO_1km --nomask ETOPO1_Ice_g.tif
gebuild Resources/Terrain/ETOPO_1km

geaddtoterrainproject -o Projects/Terrain Resources/Terrain/ETOPO_1km
gebuild Projects/Terrain
