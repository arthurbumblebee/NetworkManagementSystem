/*jshint esversion: 6 */
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var child_process = require('child_process');
var path = require('path');
var mysql = require('mysql');
var dot = require('dot-object');


// Create a server 
http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("pathname original", pathname.substr(1));

    // maps file extention to MIME typere
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
    };

    // Print the name of the file for which request is made
    console.log("Request for " + pathname + " received.");

    var query = querystring.parse(url.parse(request.url).query);
    var queryaction = dot.remove('queryAction', query);
    console.log("querying ", queryaction);

    if (queryaction == "showLocation") {
        var sqlshowLocation = "SELECT * FROM robotLocation WHERE robotID = ?";
        var locateItem = dot.remove("robotid", query);
        console.log("robot location : ", locateItem);
        connection.query(sqlshowLocation, [locateItem], function(err, result) {
            if (err) {
                console.log("error occured while trying to get location");
                response.statusCode = 500;
                response.end(`Error getting the location: ${err}.`);
            } else {
                response.writeHead(200, { 'content-type': 'application/json' });
                response.end(JSON.stringify(result));
            }
        });
    }
    if (queryaction == 'populate') {
        connection.query("SELECT * FROM ROBOTS", function(err, result) {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify(result));
        });
    }
    // https://github.com/mysqljs/mysql#performing-queries
    if (queryaction == 'update') {
        // update robot information
        var searchUsing = dot.remove('robotid', query);
        var ipaddress = dot.remove('ip', query);
        var batteryDate = dot.remove('battery', query);
        console.log("update", searchUsing);

        var sqlUpdate = "UPDATE ROBOTS SET IPaddress = ?, batteryAddedDate = ? WHERE robotID = ?";
        connection.query(sqlUpdate, [ipaddress, batteryDate, searchUsing], function(err) {});

    }
    if (queryaction == 'delete') {
        var deleteItem = dot.remove('robot', query);
        console.log("delete", deleteItem);

        var sqlDelete = "DELETE FROM ROBOTS WHERE robotID = ?";
        var sqlDeleteLocations = "DELETE FROM robotLocation WHERE robotID = ?";

        connection.query(sqlDeleteLocations, [deleteItem], function(err) {});
        connection.query(sqlDelete, [deleteItem], function(err) {});

    }
    if (queryaction == 'deletelocations') {
        var deleteItem = dot.remove('robotid', query);
        console.log("delete locations for", deleteItem);

        var sqlDeleteLocations = "DELETE FROM robotLocation WHERE robotID = ?";
        connection.query(sqlDeleteLocations, [deleteItem], function(err) {});

    }
    if (queryaction == 'search') {
        // look up robot information
        var searchItem = dot.remove('robot', query);
        console.log("information for robot ", searchItem);
        var sqlSearch = "SELECT * FROM ROBOTS WHERE robotID = ?";

        connection.query(sqlSearch, [searchItem], function(err, result) {
            response.writeHead(200, { 'content-type': 'application/json' });
            console.log("data received", JSON.stringify(result));
            response.end(JSON.stringify(result));
        });

    }

    // read file from file system
    fs.readFile(pathname.substr(1), function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.end(`Error getting the file: ${err}.`);
        } else {
            response.end(data);
        }
    });
    // });
}).listen(8000);

console.log('Server running at http://localhost:8000/');

// scp -r /Volumes/Arthur/Colby/2017/Summer2017/Research/Website amakumbi@kili.cs.colby.edu:/export/home/amakumbi/research
// https://github.com/mysqljs/mysql#performing-queries

// connect to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    user: "amakumbi",
    password: "wdio3fzwd",
    database: "yingli"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");

});

connection.on('close', function(err) {
    if (err) {
        // Oops! Unexpected closing of connection, lets reconnect back.
        connection = mysql.createConnection(connection.config);
    } else {
        console.log('Connection closed normally.');
    }
});