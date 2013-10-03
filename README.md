sosi.js
=======

Library to read SOSI files in Javascript

Status
------
This is just an attempt to see if it's posible to parse SOSI-files at all in javascript without too much hassle.
The data/testfile.sos is the example file found in the document "SOSI standard - versjon 4.5 Del 1: Realisering i SOSI-format og GML"
(see http://www.statkart.no/Documents/Standard/SOSI-standarden%20del%201%20og%202/SOSI%20standarden/del1_2_RealiseringSosiGml_45_20120608.pdf)

There will obviously be some shortcuts, so the goals are as follows:

- Focus on utf-8 SOSI documents
- Defer the axis ordering issue
- get the following geometry-types to work
-- PUNKT
-- KURVE
-- FLATE
- ignore the rest for now
- use SRID instead of the sosi-specific codes
- lightweight
- good test coverage
- learn a bit more about the format
- output features as either:
    - geoJSON
    - TopoJSON
    - OpenLayers (2 or 3) features
    - Leaflet Layers
- ignore backwards compability

Building
-------
- checkout the project
 $npm install
 $grunt

Running tests
-------------
 $buster-server &
 $buster-test


Dependencies
------------
The only dependency is underscore.js (although jQuery is used for the tests)

Contribute
----------
All contributions welcome! If you speak SOSI _and_ Javascript fluently you are more than welcome to take over.
Otherwise, send pull requests or ask for commit privileges. If you by chance have any SOSI files that are freely
usable I'd appreciate some input so that the test set can be expanded.

Disclaimer
----------
This lib must not be used for critical applications, as the test set is veeeeeery limited.
