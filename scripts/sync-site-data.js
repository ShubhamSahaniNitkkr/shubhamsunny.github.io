/**
 * Writes assets/js/site-data.js from assets/data/site.json so the site works
 * when opening index.html over file:// (fetch() is blocked for local JSON).
 * After editing site.json: node scripts/sync-site-data.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "assets", "data", "site.json");
const outPath = path.join(root, "assets", "js", "site-data.js");

const obj = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const banner =
  "/* Generated from assets/data/site.json. Run: node scripts/sync-site-data.js */\n";
const body =
  banner + "window.__SITE_DATA__ = " + JSON.stringify(obj) + ";\n";

fs.writeFileSync(outPath, body, "utf8");
console.log("Wrote", outPath);
