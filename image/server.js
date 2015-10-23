var express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http),
    Tail    = require('tail').Tail,
    port    = 9001;

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

var fileToTail = "/path/logs/file";
var lineSeparator= "\n";
var fromBeginning = true;
var watchOptions = {};

var tail = new Tail(fileToTail, lineSeparator, watchOptions, fromBeginning);

tail.on('line', function(data) {

  io.emit('log', data);

});

app.get('/log', function(req, res){

  var output = '<!doctype html><html><style>body{white-space: pre;background-color: #333;color: #ddd;font-family: monospace;}</style><body>';
  var exec = require('child_process').exec;

  exec('cat ' + fileToTail, function(error, stdout, stderr) {

    output += stdout;
    output += '</body></html>';

    res.send(output);

  });
});

app.get('/tail/:lines', function(req, res){

  var lines = req.params.lines;

  var exec = require('child_process').exec;
  var command = 'tail -' + lines + ' ' + fileToTail;

  exec(command, function(error, stdout, stderr) {
    res.send(stdout);
  });
});

http.listen(port, function () {
  console.log('Server listening on *:' + port);
});
