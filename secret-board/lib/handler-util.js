'use strict';

const fs = require('fs');

function handleLogout(req, res) {
    res.writeHead(401, {
        'Content-type': 'text/html; charset=utf-8'
    });
    res.end('<!DOCTYPE html><html lang="ja"><body>' +
    '<h1>ログアウトしました</h1>' +
    '<a href="/posts">ログイン</a>' +
    '</body></html>'
  );
}

function handleNotFound(req, res) {
    res.writeHead(404, {
        'Content-type': 'text/plain; charset=utf-8'
    });
    res.end('ページが見つかりません');
}

function handleFavicon(req, res) {
    res.writeHead(200, {
      'Content-Type': 'image/vnd.microsoft.icon'
    });
    const favicon = fs.readFileSync('./favicon.ico');
    res.end(favicon);
  }

module.exports = {
    handleLogout,
    handleNotFound,
    handleFavicon
};