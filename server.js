const path = require('path');
const fs = require('fs');
const untildify = require('untildify');
const express = require('express');
const https = require('https');
const argv = require('yargs').usage('Usage: $0 --appno [appno] --key [key] --cert [cert] --port [port] --sw-url [Service Worker URL] --sw-path [Service Worker Path]').demandOption(['appno', 'key', 'cert']).argv;
const app = express();

app.set('view engine', 'ejs');

const port = argv['port'] || process.env.PORT || 3000;

const options = {
  key: fs.readFileSync(path.resolve(untildify(argv['key']))),
  cert: fs.readFileSync(path.resolve(untildify(argv['cert']))),
}
const server = https.createServer(options, app);

const params = {
  appno: argv['appno'],
  sw: argv['sw'] || 'https://aldebaran.push7.com/ex-push7-worker.js'
}

app.get('/', function (req, res) {
  res.render(path.resolve(__dirname, './src/index.ejs'), { ...params, host: req.get('host') });
});

app.get('/push7-worker.js', function (req, res) {
  res.type('text/javascript');
  if(!!argv['sw-path']) {
    // sw-path が設定されている場合はそちらを優先する
    res.sendFile(untildify(argv['sw-path']))
    return
  }
  res.render(path.resolve(__dirname, './src/push7-worker.ejs'), { ...params, host: req.get('host') }, (error, html) => {
    res.send(Buffer.from(html));
  });
});

app.use("/", express.static(path.resolve(__dirname, './public_html')));
server.listen(port, () => console.log(`app listening on port ${port}`));
