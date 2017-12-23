"use strict";

var assert = require("assert");

var detect = require("../lib/detect")();

describe("test lib/detect", function () {
    it("非法参数时，返回 application/octet-stream", function () {
        assert.equal(detect(), "application/octet-stream"); 
    });
    it("扩展名不区别大小写", function () {
        var mimeType = "text/plain";
        assert.equal(detect("txt"), mimeType);
        assert.equal(detect("TXT"), mimeType);
    });
    it("扩展名前可带 .，如 .txt", function () {
        var mimeType = "text/plain";
        assert.equal(detect(".txt"), mimeType);
    });
    it("未知扩展名，返回 application/octet-stream", function () {
        assert.equal(detect(".xxx"), "application/octet-stream");
    });
});
