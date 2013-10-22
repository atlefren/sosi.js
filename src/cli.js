if (!(typeof require == "undefined")) { /* we are running inside nodejs */
  var fs = require("fs")
  var util = require("util")

  var parser = new SOSI.Parser();
  
  if (process.argv.length < 4) { 
    util.print("\nusage: nodejs SOSI.js.js format infile.sos > outfile\n\n"
               + "where: format     : one of [" + parser.getFormats() + "]\n"
               + "       infile.sos : a file in SOSI format\n"
               + "       outfile    : an output file name, omit for stdout\n\n"
    );
    process.exit(1);
  } 

  var format   = process.argv[2],
      filename = process.argv[3];
  fs.readFile(filename, "utf8", function(err, data) {
    /* todo: detect TEGNSETT/encoding in the first bytes and re-read the file with the proper encoding */
    if (err) {
      return util.print(err);
    }
    json       = parser.parse(data).dumps(format);
    util.print(JSON.stringify(json)); /* only for GeoJSON or TopoJSON */
  });

}

