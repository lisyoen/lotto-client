var http = require('http');
var fs = require('fs');

var port = 4000;
http.createServer(function (req, res) {
  var file = fs.readFileSync('test.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(file);
}).listen(port);
console.log("Web Server start. port:", port);