if (!(typeof require == "undefined")) { /* we are running inside nodejs */
  var fs = require("fs")
  var util = require("util")
  
  if (process.argv.length < 3) { 
    util.print("\nusage: nodejs SOSI.js.js filename.sos > filename.geojson\n");
    process.exit(1);
  } 

  var filename = process.argv[2];
  fs.readFile(filename, "utf8", function(err, data) {
    /* todo: detect TEGNSETT/encoding in the first bytes and re-read the file with the proper encoding */
    if (err) {
      return util.print(err);
    }
    var parser = new SOSI.Parser();
    json       = parser.parse(data).dumps("geojson");
    util.print(JSON.stringify(json));
  });

}

