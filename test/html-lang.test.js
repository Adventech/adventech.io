"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const documents = [
  "index.html",
  "about/index.html",
  "donate.html",
  "donate/index.html",
  "sabbath-school/index.html"
];

documents.forEach((documentPath) => {
  test(`${documentPath} declares its English document language`, () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "..", documentPath),
      "utf8"
    );

    assert.match(
      html,
      /<html\b[^>]*\blang=["']en["'][^>]*>/i,
      `${documentPath} must declare lang="en" on its html element`
    );
  });
});
