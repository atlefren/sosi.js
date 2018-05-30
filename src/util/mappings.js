'use strict';

var geosysMap = {
    2: {'srid': 'EPSG:4326', def: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '}
};

var koordsysMap = {
    //NGO-akse I, NGO1948, Gauss-Krüger
    1: {'srid': 'EPSG:27391', 'def': '+proj=tmerc +lat_0=58 +lon_0=-4.666666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO-akse II, NGO1948, Gauss-Krüger
    2: {'srid': 'EPSG:27392', 'def': '+proj=tmerc +lat_0=58 +lon_0=-2.333333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO-akse III, NGO1948, Gauss-Krüger
    3: {'srid': 'EPSG:27393', 'def': '+proj=tmerc +lat_0=58 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO-akse IV, NGO1948, Gauss-Krüger
    4: {'srid': 'EPSG:27394', 'def': '+proj=tmerc +lat_0=58 +lon_0=2.5 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO-akse V, NGO1948, Gauss-Krüger
    5: {'srid': 'EPSG:27395', 'def': '+proj=tmerc +lat_0=58 +lon_0=6.166666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO-akse VI, NGO1948, Gauss-Krüger
    6: {'srid': 'EPSG:27396', 'def': '+proj=tmerc +lat_0=58 +lon_0=10.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO-akse VII, NGO1948, Gauss-Krüger
    7: {'srid': 'EPSG:27397', 'def': '+proj=tmerc +lat_0=58 +lon_0=14.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO-akse VIII, NGO1948, Gauss-Krüger
    8: {'srid': 'EPSG:27398', 'def': '+proj=tmerc +lat_0=58 +lon_0=18.33333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    //NGO1948 , datum NGO1948, Geografisk
    9: {'srid': 'EPSG:4273', 'def': '+proj=longlat +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +no_defs'},

    //UTM sone 31,basert på EUREF89 
    21: {'srid': 'EPSG:25831', 'def': '+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'},
    //UTM sone 32 basert på EUREF89
    22: {'srid': 'EPSG:25832', 'def': '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'},
    //uTM sone 33 basert på EUREF89
    23: {'srid': 'EPSG:25833', 'def': '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'},
    //UTM sone 34 basert på EUREF89
    24: {'srid': 'EPSG:25834', 'def': '+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'},
    //UTM sone 35 basert på EUREF89 
    25: {'srid': 'EPSG:25835', 'def': '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'},
    //UTM sone 36 basert på EUREF89
    26: {'srid': 'EPSG:25836', 'def': '+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'},

    //UTM sone 31 basert på ED50
    31: {'srid': 'EPSG:23031', def: '+proj=utm +zone=31 +ellps=intl +units=m +no_defs'},
    //UTM sone 32 basert på ED50
    32: {'srid': 'EPSG:23032', def: '+proj=utm +zone=32 +ellps=intl +units=m +no_defs'},
    //UTM sone 33 basert på ED50
    33: {'srid': 'EPSG:23033', def: '+proj=utm +zone=33 +ellps=intl +units=m +no_defs'},
    //UTM sone 34 basert på ED50
    34: {'srid': 'EPSG:23034', def: '+proj=utm +zone=34 +ellps=intl +units=m +no_defs'},
    //UTM sone 35 basert på ED50
    35: {'srid': 'EPSG:23035', def: '+proj=utm +zone=35 +ellps=intl +units=m +no_defs'},
    //UTM sone 36 basert på ED50
    36: {'srid': 'EPSG:23036', def: '+proj=utm +zone=36 +ellps=intl +units=m +no_defs'},

    //UTM sone 31,basert på WGS84 
    61: {'srid': 'EPSG:32631', 'def': '+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    //UTM sone 32 basert på WGS84
    62: {'srid': 'EPSG:32632', 'def': '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    //uTM sone 33 basert på WGS84
    63: {'srid': 'EPSG:32633', 'def': '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    //UTM sone 34 basert på WGS84
    64: {'srid': 'EPSG:32634', 'def': '+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    //UTM sone 35 basert på WGS84 
    65: {'srid': 'EPSG:32635', 'def': '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    //UTM sone 36 basert på WGS84
    66: {'srid': 'EPSG:32636', 'def': '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},



    50: {'srid': 'EPSG:4230', def: '+proj=longlat +ellps=intl +no_defs'},
    72: {'srid': 'EPSG:4322', def: '+proj=longlat +ellps=WGS72 +no_defs '},
    84: {'srid': 'EPSG:4326', def: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '},
    87: {'srid': 'EPSG:4231', 'def': '+proj=longlat +ellps=intl +no_defs '}




    //41 Lokalnett, uspes.
    //42 Lokalnett, uspes.
    //51 NGO-56A (Møre) NGO1948 Gauss-Krüger
    //52 NGO-56B (Møre) NGO1948 Gauss-Krüger
    //53 NGO-64A (Møre) NGO1948 Gauss-Krüger
    //54 NGO-64B (Møre) NGO1948 Gauss-Krüger
    //99 Egendefinert *
    //101 Lokalnett, Oslo
    //102 Lokalnett, Bærum
    //103 Lokalnett, Asker
    //104 Lokalnett, Lillehammer
    //105 Lokalnett,Drammen
    //106 Lokalnett, Bergen / Askøy
};

module.exports = {
    geosysMap: geosysMap,
    koordsysMap: koordsysMap
};
