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

timer.scheduleJob('*/5 * * * *', function() {
  return getWeather(function(data) {
    if (data !== 'No data available') {
      return parseData(data, function(apiObj) {
        var PRECIP, PRESSUREAVG, RELHUM2MAVG, SLPAVG, SOILTMP10AVG, SOILTMP20AVG, SOILTMP40AVG, SOILTMP5AVG, SOILTMP60AVG, SRAVG, STATION, TEMP2MAVG, TEMP2MMAX, TEMP2MMIN, TIMESTAMP, VPDEFAVG, VWC20CM, VWC40CM, VWC60CM, WDIR10M, WDIR10MSTD, WDIR2M, WDIR2MSTD, WGST10MTIME, WGST2MTIME, WSPD10MAVG, WSPD10MMAX, WSPD2MAVG, WSPD2MMAX, query;
        TIMESTAMP = (apiObj != null ? apiObj.TIMESTAMP : void 0) != null ? apiObj.TIMESTAMP : null;
        STATION = (apiObj != null ? apiObj.STATION : void 0) != null ? apiObj.STATION : null;
        PRESSUREAVG = (apiObj != null ? apiObj.PRESSUREAVG : void 0) != null ? apiObj.PRESSUREAVG : null;
        SLPAVG = (apiObj != null ? apiObj.SLPAVG : void 0) != null ? apiObj.SLPAVG : null;
        TEMP2MAVG = (apiObj != null ? apiObj.TEMP2MAVG : void 0) != null ? apiObj.TEMP2MAVG : null;
        TEMP2MMIN = (apiObj != null ? apiObj.TEMP2MMIN : void 0) != null ? apiObj.TEMP2MMIN : null;
        TEMP2MMAX = (apiObj != null ? apiObj.TEMP2MMAX : void 0) != null ? apiObj.TEMP2MMAX : null;
        RELHUM2MAVG = (apiObj != null ? apiObj.RELHUM2MAVG : void 0) != null ? apiObj.RELHUM2MAVG : null;
        VPDEFAVG = (apiObj != null ? apiObj.VPDEFAVG : void 0) != null ? apiObj.VPDEFAVG : null;
        PRECIP = (apiObj != null ? apiObj.PRECIP : void 0) != null ? apiObj.PRECIP : null;
        SRAVG = (apiObj != null ? apiObj.SRAVG : void 0) != null ? apiObj.SRAVG : null;
        WSPD2MAVG = (apiObj != null ? apiObj.WSPD2MAVG : void 0) != null ? apiObj.WSPD2MAVG : null;
        WSPD2MMAX = (apiObj != null ? apiObj.WSPD2MMAX : void 0) != null ? apiObj.WSPD2MMAX : null;
        WSPD10MAVG = (apiObj != null ? apiObj.WSPD10MAVG : void 0) != null ? apiObj.WSPD10MAVG : null;
        WSPD10MMAX = (apiObj != null ? apiObj.WSPD10MMAX : void 0) != null ? apiObj.WSPD10MMAX : null;
        WGST10MTIME = (apiObj != null ? apiObj.WGST10MTIME : void 0) != null ? apiObj.WGST10MTIME : null;
        WDIR2M = (apiObj != null ? apiObj.WDIR2M : void 0) != null ? apiObj.WDIR2M : null;
        WDIR2MSTD = (apiObj != null ? apiObj.WDIR2MSTD : void 0) != null ? apiObj.WDIR2MSTD : null;
        WGST2MTIME = (apiObj != null ? apiObj.WGST2MTIME : void 0) != null ? apiObj.WGST2MTIME : null;
        WDIR10M = (apiObj != null ? apiObj.WDIR10M : void 0) != null ? apiObj.WDIR10M : null;
        WDIR10MSTD = (apiObj != null ? apiObj.WDIR10MSTD : void 0) != null ? apiObj.WDIR10MSTD : null;
        SOILTMP5AVG = (apiObj != null ? apiObj.SOILTMP5AVG : void 0) != null ? apiObj.SOILTMP5AVG : null;
        SOILTMP10AVG = (apiObj != null ? apiObj.SOILTMP10AVG : void 0) != null ? apiObj.SOILTMP10AVG : null;
        SOILTMP20AVG = (apiObj != null ? apiObj.SOILTMP20AVG : void 0) != null ? apiObj.SOILTMP20AVG : null;
        SOILTMP40AVG = (apiObj != null ? apiObj.SOILTMP40AVG : void 0) != null ? apiObj.SOILTMP40AVG : null;
        SOILTMP60AVG = (apiObj != null ? apiObj.SOILTMP60AVG : void 0) != null ? apiObj.SOILTMP60AVG : null;
        VWC20CM = (apiObj != null ? apiObj.VWC20CM : void 0) != null ? apiObj.VWC20CM : null;
        VWC40CM = (apiObj != null ? apiObj.VWC40CM : void 0) != null ? apiObj.VWC40CM : null;
        VWC60CM = (apiObj != null ? apiObj.VWC60CM : void 0) != null ? apiObj.VWC60CM : null;
        if (TIMESTAMP != null) {
          query = "INSERT INTO `manhattan`( `timestamp`, `station`, `pressureavg`, `slpavg`, `temp2mavg`, `temp2mmin`, `temp2mmax`, `relhum2mavg`, `vpdefavg`, `precip`, `sravg`, `wspd2mavg`, `wspd2mmax`, `wspd10mavg`, `wspd10mmax`, `wdir2m`, `wdir2mstd`, `wdir10m`, `wdir10mstd`, `soiltmp5avg`, `soiltmp10avg`, `soiltmp20avg`, `soiltmp40avg`, `soiltmp60avg`, `vwc20cm`, `vwc40cm`, `vwc60cm` ) VALUES ( '" + TIMESTAMP + "', '" + STATION + "', " + PRESSUREAVG + ", " + SLPAVG + ", " + TEMP2MAVG + ", " + TEMP2MMIN + ", " + TEMP2MMAX + ", " + RELHUM2MAVG + ", " + VPDEFAVG + ", " + PRECIP + ", " + SRAVG + ", " + WSPD2MAVG + ", " + WSPD2MMAX + ", " + WSPD10MAVG + ", " + WSPD10MMAX + ", " + WDIR2M + ", " + WDIR2MSTD + ", " + WDIR10M + ", " + WDIR10MSTD + ", " + SOILTMP5AVG + ", " + SOILTMP10AVG + ", " + SOILTMP20AVG + ", " + SOILTMP40AVG + ", " + SOILTMP60AVG + ", " + VWC20CM + ", " + VWC40CM + ", " + VWC60CM + " )";
          return mysqlQuery(query, function(queryRes) {
            if (queryRes != null) {
              return console.log(queryRes);
            } else {
              return console.log('error');
            }
          });
        }
      });
    }
  });
});

server.listen(PORT, function() {
  return console.log("Listening on port " + PORT);
});
