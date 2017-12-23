"use strict";

var assert = require("assert");

var mime = require("../lib/mime")();

describe("test lib/mime", function () {
    it("非法参数时，返回 application/octet-stream", function () {
        assert.equal(mime(), "application/octet-stream"); 
    });
    it(".txt 返回 text/plain", function () {
        assert.equal(mime(".txt"), "text/plain");
        assert.equal(mime(".txt"), "text/plain");
    });
    it("未知扩展名，返回 application/octet-stream", function () {
        assert.equal(mime(".xxx"), "application/octet-stream");
    });
});

