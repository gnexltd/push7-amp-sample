const path = require('path');
const fs = require('fs');

const ejs = require('ejs');
const untildify = require('untildify');

const argv = require('yargs').usage('Usage: $0 --host [host] --appno [appno] --sw-url [Service Worker URL] --sw-path [Service Worker Path]').demandOption(['host', 'appno']).argv;

const params = {
  host: argv['host'],
  appno: argv['appno'],
  sw: argv['sw'] || 'https://aldebaran.push7.com/ex-push7-worker.js'
}

fs.writeFileSync(path.resolve(__dirname, 'public_html/index.html'), ejs.render(fs.readFileSync(path.resolve(__dirname, 'src/index.ejs')).toString(), params))
if (argv['sw-path']) {
  // sw-path が指定されている場合はそちらを優先
  fs.writeFileSync(path.resolve(__dirname, 'public_html/push7-worker.js'), fs.readFileSync(path.resolve(__dirname, untildify(argv['sw-path']))))
} else {
  fs.writeFileSync(path.resolve(__dirname, 'public_html/push7-worker.js'), ejs.render(fs.readFileSync(path.resolve(__dirname, 'src/push7-worker.ejs')).toString(), params))
}
