sosi.js
=======

Library to read SOSI files in Javascript

Status
------
This is just an attempt to see if it's posible to parse SOSI-files at all in javascript without too much hassle.
The data/testfile.sos is the example file found in the document ["SOSI standard - versjon 4.5 Del 1: Realisering i SOSI-format og GML"](http://www.statkart.no/Documents/Standard/SOSI-standarden%20del%201%20og%202/SOSI%20standarden/del1_2_RealiseringSosiGml_45_20120608.pdf) (pdf).

There will obviously be some shortcuts, so the goals are as follows:

- Focus on utf-8 SOSI documents
- Defer the axis ordering issue
- get the following geometry-types to work
    - PUNKT
    - KURVE
    - FLATE
    - TRASE (perhaps)
- ignore the rest for now
- use SRID instead of the sosi-specific codes
- lightweight
- good test coverage
- learn a bit more about the format
- output features as either:
    - geoJSON (implemented)
    - TopoJSON (implemented)
    - OpenLayers (2 or 3) features
    - Leaflet Layers
- ignore backwards compability

Demo
----
See: https://rawgithub.com/atlefren/sosi.js/master/example/index.html

Usage
-----
    //create a parser
    var parser = new SOSI.Parser();

    //parse SOSI-data (must be a newline-separated string!)
    var sosidata = parser.parse(my_data);

    //get the "hode"
    var hode = sosidata.hode;
    var srid = hode.srid; //get srid
    var bbox = hode.bbox; //get bbox
    //etc

    //get number of features
    var num_features = sosidata.features.length();

    //get all features
    var features = sosidata.features.all();

    //get feature by index
    var feature1 = sosidata.features.at(0); //0-indexed

    //get feature by ID:
    var feature1 = sosidata.features.getById(200);

    //get as GeoJSON
    var geojson = sosidata.dumps("geojson");

    //get as TopoJSON (non-quantized for now)
    var geojson = sosidata.dumps("topojson", "name_of_objects");

Building
-------
- checkout the project
    $ npm install
    $ grunt

Running tests
-------------
    $ buster-server &
    $ buster-test

Dependencies
------------
The only hard dependency is underscore.js (although jQuery is used for the tests and leaflet and backbone is used for the example)
Optional support for proj4js (loads the proj4 definitions for crses known to sosi.js)

Contribute
----------
All contributions welcome! If you speak SOSI _and_ Javascript fluently you are more than welcome to take over.
Otherwise, send pull requests or ask for commit privileges. If you by chance have any SOSI files that are freely
usable I'd appreciate some input so that the test set can be expanded.

Contributors
------------
In addition to myself (atlefren) some people have contributed code and/or input to this project_
- Thomas Hirsch (relet)
- Torbjørn Auglænd Vilhelmsen (torbjvi)
- SigTill

Disclaimer
----------
This lib must not be used for critical applications, as the test set is veeeeeery limited.