const path = require("path");
const fs = require("fs");

const ejs = require("ejs");
const untildify = require("untildify");
const minify = require("html-minifier").minify;

const argv = require("yargs")
  .usage(
    "Usage: $0 --host [host] --appno [appno] --sw-url [Service Worker URL] --sw-path [Service Worker Path]"
  )
  .demandOption(["host", "appno"]).argv;

const params = {
  host: argv["host"],
  appno: argv["appno"],
  sw:
    typeof argv["sw-url"] === "string"
      ? argv["sw-url"]
      : "https://aldebaran.push7.jp/ex-push7-worker.js",
};

const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "public_html");

const htmlFiles = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .filter(({ name }) => /^(?!_).+\.html$/.test(name))
  .map(({ name }) => name);

for (let htmlFile of htmlFiles) {
  fs.writeFileSync(
    path.resolve(distDir, htmlFile),
    minify(
      ejs.render(fs.readFileSync(path.resolve(srcDir, htmlFile)).toString(), {
        ...params,
        filename: path.resolve(srcDir, htmlFile),
      }),
      {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: false,
        minifyCSS: true,
        minifyJS: true,
        keepClosingSlash: true,
        processConditionalComments: true,
        removeAttributeQuotes: false,
        removeComments: true,
        removeEmptyAttributes: false,
        removeOptionalTags: false,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        trimCustomFragments: true,
      }
    )
  );
}

if (argv["sw-path"]) {
  // sw-path が指定されている場合はそちらを優先
  fs.writeFileSync(
    path.resolve(distDir, "push7-worker.js"),
    fs.readFileSync(path.resolve(__dirname, untildify(argv["sw-path"])))
  );
} else {
  fs.writeFileSync(
    path.resolve(__dirname, "public_html/push7-worker.js"),
    ejs.render(
      fs.readFileSync(path.resolve(srcDir, "push7-worker.js")).toString(),
      params
    )
  );
}
