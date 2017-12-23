"use strict";

module.exports = function () {
    var unknowMIMEType = "application/octet-stream";
    var mimeTypes = new Map([
        ["txt",  "text/plain"],             
        ["htm",  "text/html"],              
        ["html", "text/html"],              
        ["xml",  "text/xml"],               
        ["css",  "text/css"],               
        ["js",   "application/javascript"], 
        ["json", "application/json"],       

        ["mp3",  "audio/mpeg"],             
        ["wav",  "audio/wav"],              

        ["gif",  "image/gif"],              
        ["jpg",  "image/jpeg"],             
        ["jpeg", "image/jpeg"],             
        ["png",  "image/png"],              
        ["bmp",  "image/bmp"],              

        ["avi",  "video/avi"],              
        ["mp4",  "video/mpeg"]
    ]);

    return function (ext) {
        if (!ext || typeof ext !== "string") {
            return unknowMIMEType;
        }
        if (/^\./.test(ext)) {
            ext = ext.slice(1);
        }

        ext = ext.toLowerCase();

        if (mimeTypes.has(ext)) {
            return mimeTypes.get(ext);
        } else {
            return unknowMIMEType;
        }
    };
};
