var PORT, app, express, http, io, moment, path, pug, server, socket;

express = require('express');

http = require('http');

moment = require('moment');

path = require('path');

pug = require('pug');

socket = require('socket.io');

PORT = 3000;

app = express();

app.set('views', './views');

app.set('view engine', 'pug');

server = http.createServer(app);

io = socket(server);

app.use('/static', express["static"](path.join(__dirname, 'public')));

app.use('/static', express["static"](path.join(__dirname, 'bower_components')));

app.get('/', function(req, res) {
  return res.render('index', {
    title: 'Hey',
    message: 'Hello there!',
    copyright: moment().format('YYYY')
  });
});

server.listen(PORT, function() {
  return console.log("Listening on port " + PORT);
});