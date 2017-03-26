var PORT, app, config, csv, express, getWeather, http, io, moment, mysql, mysqlQuery, parseData, path, pug, server, socket, timer;

config = require('./config/config');

csv = require('csvtojson');

express = require('express');

http = require('http');

moment = require('moment');

mysql = require('mysql');

path = require('path');

pug = require('pug');

socket = require('socket.io');

timer = require('node-schedule');

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

mysqlQuery = function(query, next) {
  var connection, result;
  connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database
  });
  result = false;
  connection.connect(function(err) {
    if (err) {
      console.error(err);
      return;
    }
    return console.log('Connected as id ' + connection.threadId);
  });
  connection.query(query, function(err, rows, fields) {
    if (err == null) {
      return result = rows;
    } else {
      console.error(err);
      return result = false;
    }
  });
  return connection.end(function(err) {
    if (err == null) {
      console.log('Closing connection of id ' + connection.threadId);
      return next(result);
    } else {
      console.error(err);
      return next(false);
    }
  });
};

getWeather = function(next) {
  var itvl, time, url;
  if (moment().isDST()) {
    time = moment().subtract(1, 'hour').minutes(5 * Math.floor(moment().subtract(5, 'minute').minutes() / 5)).format('YYYYMMDDHHmm00');
  } else {
    time = moment().minutes(5 * Math.floor(moment().subtract(5, 'minute').minutes() / 5)).format('YYYYMMDDHHmm00');
  }
  itvl = '5min';
  url = config.mesonet + '&int=' + itvl + '&t_start=' + time + '&t_end=' + time;
  console.log(url);
  return http.get(url, function(response) {
    var buffer;
    buffer = '';
    response.on('data', function(chunk) {
      return buffer += chunk;
    });
    return response.on('end', function(err) {
      return next(buffer);
    });
  });
};

parseData = function(data, next) {
  var apiObj;
  apiObj = [];
  return csv().fromString(data).on('json', function(row) {
    return apiObj.push(row);
  }).on('done', function() {
    return next(apiObj[0]);
  });
};

timer.scheduleJob('*/1 * * * *', function() {
  return mysqlQuery('SELECT `temp2mavg`, `timestamp` FROM `manhattan` WHERE MOD(`id`, 18) = 0', function(prodRes) {
    return io.emit('temperature', {
      data: prodRes
    });
  });
});

server.listen(PORT, function() {
  return console.log("Listening on port " + PORT);
});
