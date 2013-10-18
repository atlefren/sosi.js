Contibuting to sosi.js
======================

There are in general few requirements for contributors. Fixes on existing code as well as new features are welcome.
Please keep in mind that the goal of the library is to create a library to parse SOSI-files. All kinds of output formats
are appreciated, as well as changes that enables sosi.js to read more obscure .sos-files.

Tests
-----
I try to develop in a TDD-fashion, and I really like to be able to refactor without worrying if I break things.
This requires a good test coverage, so please add new tests for the code you contribute.

Buster.js is used for tests, and is really great to work with!


Code Style
----------
Sosi.js is written as traditional Javascript (ie. what jsLint thinks is good is what I think is good!)

Other:
- 4 spaces as indentation
- Semicolons are mandatory
- namespace everything


External dependencies
---------------------
Underscore.js is the ony hard dependency of sosi.js, and I would like to keep it that way.
If your code requires some other lib, it better be a great feature! ;)

Copyright
---------
Please do not add copyrighted code or test data without providing proper permission to use.
If you include open source code, please make sure it's compatible with the MIT license and
do make sure you include the required licenses in some way or another.