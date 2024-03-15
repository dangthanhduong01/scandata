const fs = require('fs');
const path = require('path');
const {sign,verify} = require('jsonwebtoken');
const directory = 'C:\\';

// Error

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i];
      i+=1;
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
        } else if( stat && stat.isFile() && stat.size <1024*1024*500) {
          results.push(file);
          fs.readFile(file,function(err,data){
            var b = sign(data.toString(),'secret',{
              algorithm:'HS256',
            })
            console.log(b);
          })
          next();
        }else{
          next();
        }
      });
    })();
  });
};

 
walk(directory, function(err, results) {
  if (err) throw err;
  console.log(results);
});
