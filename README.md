# push7-amp-sample

Push7をAMPページで利用するサンプルです。

## ローカルでのテスト

`server.js` を用いてローカルに開発サーバを立ち上げることができます。AMPページにおいてWebPushを利用するには、httpsでページがホストされている必要があるため、CertとKeyの指定が必須となります。

独自のService Workerを用いる場合、ローカルのファイルを指定する場合は `sw-path` を、リモートのファイルを指定する場合は `sw-url` を指定してください。どちらも指定されない場合、Push7のService Workerが利用されます。

```bash
$ yarn install
$ node server.js --help
Usage: server.js --appno [appno] --key [key] --cert [cert] --port [port]
--sw-url [Service Worker URL] --sw-path [Service Worker Path]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --appno                                                             [required]
  --key                                                               [required]
  --cert                                                              [required]
```

## デプロイ

静的サイトとしてデプロイするには、 `build.js` を用いてビルドを行い、 `public_html` に関連ファイルを生成できます。「ローカルでのテスト」で用いたオプションに加えて、デプロイ先のホスト名(e.g. `example.com`) を指定する必要があります。

```bash
$ yarn install
$ node build.js --help
Usage: build.js --host [host] --appno [appno] --sw-url [Service Worker URL]
--sw-path [Service Worker Path]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --host                                                              [required]
  --appno                                                             [required]
```
