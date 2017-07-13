var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var child_process = require('child_process');

// Create a server 
http.createServer(function(req, resp) {
    // Parse the request containing file name
    var pathname = url.parse(req.url).pathname;

    // Print the name of the file for which request is made
    console.log("Request for " + pathname + " received.");

    console.log(pathname);
    if (pathname == '/update') { //prefcalc
        var query = querystring.parse(url.parse(req.url).query);
        console.log(query);
        //console.log("IP info " + query + " received.");

        var spawn = child_process.spawn;
        var py = spawn('python', ['subnet3.py']);
        var dataString = '';
        py.stdout.on('data', function(data) {
            dataString = data;
        });
        py.stdout.on('end', function() {
            console.log("Going to write ", dataString, " into prefcalc");
            fs.writeFile('prefcalc', dataString, function(err) {
                if (err) { // if error throw it
                    console.log(err);
                }
                console.log("Data written successfully!");
                // Read the requested file content from file system
                fs.readFile(pathname.substr(1), function(err, data) {
                    if (err) {
                        console.log(err);
                        // HTTP Status: 404 : NOT FOUND
                        // Content Type: text/plain
                        resp.writeHead(404, { 'Content-Type': 'text/html' });
                    } else {
                        // Page found
                        // HTTP Status: 200 : OK
                        // Content Type: text/plain
                        resp.writeHead(200, { 'Content-Type': 'text/html' });

                        // Write the content of the file to response body
                        resp.write(data.toString());
                        console.log("to send to site", data.toString());
                    }
                    // Send the response body
                    resp.end();
                });
            });
        });
        py.stdin.write(JSON.stringify(query));
        py.stdin.end();
    } else {
        // Read the requestedf file content from file system
        fs.readFile(pathname.substr(1), function(err, data) {
            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // Content Type: text/plain
                resp.writeHead(404, { 'Content-Type': 'text/html' });
            } else {
                // Page found
                // HTTP Status: 200 : OK
                // Content Type: text/plain
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                // resp.end(data);

                // Write the content of the file to response body
                // resp.write(data.toString());
                resp.write(data);
            }
            // Send the response body
            resp.end();
        });
    }
}).listen(8000);

// Console will print the message
console.log('Server running at http://localhost:8000/');