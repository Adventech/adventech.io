"use strict";

var detect = require("./detect")();

module.exports = function () {
    var mimeTypes = new Map();
    var unknowMIMEType = "application/octet-stream";

    return function (ext) {
        if (!ext) {
            return unknowMIMEType;
        }
        if (mimeTypes.has(ext)) {
            return mimeTypes.get(ext);
        } else {
            var mimeType = detect(ext);
            if (!mimeType) {
                mimeType = unknowMIMEType;
            }
            mimeTypes.set(ext, mimeType);
            return mimeType;
        }
    };
};
