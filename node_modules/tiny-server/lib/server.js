"use strict";

var fs = require("fs");
var http = require("http");
var path = require("path");
var querystring = require("querystring");
var stream = require("stream");
var util = require("util");
var url = require("url");

var mime = require("./mime")();

var Server = function Server(cwd, middlewares) {
    if (!(this instanceof Server)) {
        return new Server(cwd, middlewares);
    }
    if (!cwd) {
        cwd = process.cwd();
    }
    if (typeof middlewares === "function") {
        middlewares = [middlewares];
    } else if (!Array.isArray(middlewares)) {
        middlewares = [];
    }

    http.Server.call(this);

    this.cwd = cwd;
    this.middlewares = middlewares;

    var requestHandler = this.handler.bind(this);
    this.on("request", requestHandler);
    this.once("close", function () {
        this.removeListener("request", requestHandler);
    });
};
util.inherits(Server, http.Server);

Server.prototype.handler = function (req, res) {

    var pathname = url.parse(req.url).pathname;
    var filename = path.join(this.cwd, path.normalize(querystring.unescape(pathname)));

    var that = this;
    fs.exists(filename, function (exists) {
        if (exists) {
            fs.stat(filename, function (err, stats) {
                if (err) {
                    return that.notFound(res);
                }
                if (stats.isFile()) {
                    var ext = path.extname(filename);
                    var mimeType = mime(ext);
                    res.writeHead(200, {
                        "Content-Type": mimeType
                    });
                    fs.createReadStream(filename).pipe(res);
                } else if (stats.isDirectory()) {
                    if (!/\/$/.test(pathname)) {
                        res.writeHead(301, {
                            "Location": path.join(pathname, "/")
                        });
                        res.end();
                        return;
                    }
                    fs.readdir(filename, function (err, files) {
                        if (err) {
                            return that.notFound(res);
                        }

                        var len = files.length;
                        if (!len) {
                            dir(files);
                            return;
                        }

                        var items = [];

                        files.forEach(function (file) {
                            fs.stat(path.join(filename, file), function (err, stats) {
                                if (!err) {
                                    items.push(stats.isDirectory() ? path.join(file, "/") : file);
                                }
                                --len;
                                if (!len) {
                                    dir(items);
                                }
                            });
                        });

                        function dir(files) {
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            res.end(["",
                                '<!DOCTYPE html>',
                                '<html>',
                                '    <head>',
                                '        <meta charset="UTF-8">',
                                '        <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                                '        <title>Index of ' + pathname + '</title>',
                                '    </head>',
                                '    <body>',
                                '        <h1>Index of ' + pathname + '</h1>',
                                '        <hr>',
                                '        <ul>',
                                '            <li><a href="..">../</a></li>',
                                             files.map(function (file) {
                                                 return '            <li><a href="' + path.join(pathname, file) + '">' + file + '</a></li>';
                                             }).join("\n"),
                                '        </ul>',
                                '        <hr>',
                                '    </body>',
                                '</html>',
                            ""].join("\n"));
                        }
                    });

                } else {
                    that.notFound(res);
                }
            });
        } else {
            that.notFound(res);
        }
    });

};
Server.prototype.notFound = function (res) {
    res.writeHead(404, {
        "Content-Type": "text/html",
    });

    var file = path.join(this.cwd, "404.html");
    fs.exists(file, function (exists) {
        if (exists) {
            fs.createReadStream(file).pipe(res);
        } else {
            default404Reader().pipe(res);
        }
    });

    function default404Reader() {
        var f404 = new stream.Readable();
        f404._read = function () {

            this.push(["",
                '<!DOCTYPE html>',
                '<html>',
                '    <head>',
                '        <meta charset="UTF-8">',
                '        <title>Not Found!</title>',
                '    </head>',
                '    <body>',
                '        <h1>File Not Found!</h1>',
                '    </body>',
                '</html>',
                ""].join("\n"));
            this.push(null);

        };
        return f404;
    }
};


module.exports = Server;
