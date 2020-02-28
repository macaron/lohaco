## 自動注文ツール

EditThisCookieでcookieをエクスポートし、`amazon.json` `lohaco.json` をプロジェクトディレクトリに設置します。

```bash
$ git clone github.com/macaron/lohaco && cd lohaco
$ docker-compose run --rm nodejs node [ amazon.js | lohaco.js ]
```
