config  = require './config/config'
csv     = require 'csvtojson'
express = require 'express'
http    = require 'http'
moment  = require 'moment'
mysql   = require 'mysql'
path    = require 'path'
pug     = require 'pug'
socket  = require 'socket.io'
timer   = require 'node-schedule'

PORT    = 3000

app     = express()
app.set 'views', './views'
app.set 'view engine', 'pug'

server  = http.createServer app
io      = socket server

app.use '/static', express.static path.join __dirname, 'public'
app.use '/static', express.static path.join __dirname, 'bower_components'

app.get '/', (req, res) ->
    res.render 'index',
        title:      'Hey'
        message:    'Hello there!'
        copyright:  moment().format('YYYY')

mysqlQuery = (query, next) ->
    connection = mysql.createConnection
        host:       config.mysql.host
        user:       config.mysql.username
        password:   config.mysql.password
        database:   config.mysql.database
    result = false
    connection.connect (err) ->
        if err
            console.error err
            return
        console.log 'Connected as id ' + connection.threadId

    connection.query query, (err, rows, fields) ->
        if !err?
            result = rows
        else
            console.error err
            result = false

    connection.end (err) ->
        if !err?
            console.log 'Closing connection of id ' + connection.threadId
            next result
        else
            console.error err
            next false

getWeather = (next) ->
    if moment().isDST()
        time = moment().subtract(1, 'hour').minutes(5 * Math.floor(moment().subtract(5, 'minute').minutes() / 5)).format('YYYYMMDDHHmm00')
    else
        time = moment().minutes(5 * Math.floor(moment().subtract(5, 'minute').minutes() / 5)).format('YYYYMMDDHHmm00')
    itvl = '5min'
    url = config.mesonet + '&int=' + itvl + '&t_start=' + time + '&t_end=' + time
    http.get url, (response) ->
        buffer = ''

        response.on 'data', (chunk) ->
            buffer += chunk

        response.on 'end', (err) ->
            next buffer

parseData = (data, next) ->
    apiObj = []
    csv().fromString(data).on 'json', (row) ->
        apiObj.push row
    .on 'done', () ->
        next apiObj[0]

timer.scheduleJob '*/5 * * * *', () ->
    getWeather (data) ->
        if data isnt 'No data available'
            parseData data, (apiObj) ->
                TIMESTAMP       = if apiObj?.TIMESTAMP?     then apiObj.TIMESTAMP       else null
                STATION         = if apiObj?.STATION?       then apiObj.STATION         else null
                PRESSUREAVG     = if apiObj?.PRESSUREAVG?   then apiObj.PRESSUREAVG     else null
                SLPAVG          = if apiObj?.SLPAVG?        then apiObj.SLPAVG          else null
                TEMP2MAVG       = if apiObj?.TEMP2MAVG?     then apiObj.TEMP2MAVG       else null
                TEMP2MMIN       = if apiObj?.TEMP2MMIN?     then apiObj.TEMP2MMIN       else null
                TEMP2MMAX       = if apiObj?.TEMP2MMAX?     then apiObj.TEMP2MMAX       else null
                RELHUM2MAVG     = if apiObj?.RELHUM2MAVG?   then apiObj.RELHUM2MAVG     else null
                VPDEFAVG        = if apiObj?.VPDEFAVG?      then apiObj.VPDEFAVG        else null
                PRECIP          = if apiObj?.PRECIP?        then apiObj.PRECIP          else null
                SRAVG           = if apiObj?.SRAVG?         then apiObj.SRAVG           else null
                WSPD2MAVG       = if apiObj?.WSPD2MAVG?     then apiObj.WSPD2MAVG       else null
                WSPD2MMAX       = if apiObj?.WSPD2MMAX?     then apiObj.WSPD2MMAX       else null
                WSPD10MAVG      = if apiObj?.WSPD10MAVG?    then apiObj.WSPD10MAVG      else null
                WSPD10MMAX      = if apiObj?.WSPD10MMAX?    then apiObj.WSPD10MMAX      else null
                WGST10MTIME     = if apiObj?.WGST10MTIME?   then apiObj.WGST10MTIME     else null
                WDIR2M          = if apiObj?.WDIR2M?        then apiObj.WDIR2M          else null
                WDIR2MSTD       = if apiObj?.WDIR2MSTD?     then apiObj.WDIR2MSTD       else null
                WGST2MTIME      = if apiObj?.WGST2MTIME?    then apiObj.WGST2MTIME      else null
                WDIR10M         = if apiObj?.WDIR10M?       then apiObj.WDIR10M         else null
                WDIR10MSTD      = if apiObj?.WDIR10MSTD?    then apiObj.WDIR10MSTD      else null
                SOILTMP5AVG     = if apiObj?.SOILTMP5AVG?   then apiObj.SOILTMP5AVG     else null
                SOILTMP10AVG    = if apiObj?.SOILTMP10AVG?  then apiObj.SOILTMP10AVG    else null
                SOILTMP20AVG    = if apiObj?.SOILTMP20AVG?  then apiObj.SOILTMP20AVG    else null
                SOILTMP40AVG    = if apiObj?.SOILTMP40AVG?  then apiObj.SOILTMP40AVG    else null
                SOILTMP60AVG    = if apiObj?.SOILTMP60AVG?  then apiObj.SOILTMP60AVG    else null
                VWC20CM         = if apiObj?.VWC20CM?       then apiObj.VWC20CM         else null
                VWC40CM         = if apiObj?.VWC40CM?       then apiObj.VWC40CM         else null
                VWC60CM         = if apiObj?.VWC60CM?       then apiObj.VWC60CM         else null

                if TIMESTAMP?
                    query = "INSERT INTO `manhattan`(
                        `timestamp`,
                        `station`,
                        `pressureavg`,
                        `slpavg`,
                        `temp2mavg`,
                        `temp2mmin`,
                        `temp2mmax`,
                        `relhum2mavg`,
                        `vpdefavg`,
                        `precip`,
                        `sravg`,
                        `wspd2mavg`,
                        `wspd2mmax`,
                        `wspd10mavg`,
                        `wspd10mmax`,
                        `wdir2m`,
                        `wdir2mstd`,
                        `wdir10m`,
                        `wdir10mstd`,
                        `soiltmp5avg`,
                        `soiltmp10avg`,
                        `soiltmp20avg`,
                        `soiltmp40avg`,
                        `soiltmp60avg`,
                        `vwc20cm`,
                        `vwc40cm`,
                        `vwc60cm`
                    ) VALUES (
                        '#{TIMESTAMP}',
                        '#{STATION}',
                        #{PRESSUREAVG},
                        #{SLPAVG},
                        #{TEMP2MAVG},
                        #{TEMP2MMIN},
                        #{TEMP2MMAX},
                        #{RELHUM2MAVG},
                        #{VPDEFAVG},
                        #{PRECIP},
                        #{SRAVG},
                        #{WSPD2MAVG},
                        #{WSPD2MMAX},
                        #{WSPD10MAVG},
                        #{WSPD10MMAX},
                        #{WDIR2M},
                        #{WDIR2MSTD},
                        #{WDIR10M},
                        #{WDIR10MSTD},
                        #{SOILTMP5AVG},
                        #{SOILTMP10AVG},
                        #{SOILTMP20AVG},
                        #{SOILTMP40AVG},
                        #{SOILTMP60AVG},
                        #{VWC20CM},
                        #{VWC40CM},
                        #{VWC60CM}
                    )"
                    mysqlQuery query, (queryRes) ->
                        if queryRes?
                            console.log queryRes
                        else
                            console.log 'error'

server.listen PORT, () ->
    console.log "Listening on port #{PORT}"