var express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http);

app.use(express.static('public'));

/*io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});*/

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/refresh', function (req, res) {

  var containersList = [];

  var exec = require('child_process').exec;
  exec('docker ps', function(error, stdout, stderr) {

    var output = stdout.split('\n');

    for(var index in output) {
      var arr = output[index].split(/\s+/g);

      //console.log(arr);

      if(index != 0 && arr[0] != '') {
        containersList.push({id: arr[0], image: arr[1], name: arr[arr.length-2], created: arr[3] + ' ' + arr[4] + ' ' + arr[5]});
      }
    }

    io.emit('refresh', containersList);
    res.send('0');

  });

});

http.listen(8080, function () {
  console.log('Server listening on *:8080');
});
