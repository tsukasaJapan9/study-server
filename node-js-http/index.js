'use strict;'

const http = require('http');
const pug = require('pug');
const qs = require('querystring');

const server = http.createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.connection.remoteAddress + " method: " + req.method);

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
        case 'GET':
            if (req.url === '/enquetes/yaki-shabu') {
                res.write(pug.renderFile('./form.pug', {
                    path: req.url,
                    firstItem: '焼き肉',
                    secondItem: 'しゃぶしゃぶ'
                }));    
            } else if (req.url === '/enquetes/rice-bread') {
                res.write(pug.renderFile('./form.pug', {
                    path: req.url,
                    firstItem: 'ごはん',
                    secondItem: 'ぱん'
                }));    
            }
            res.end();
            break;
        case 'POST':
            let rawData = '';
            req.on('data', (chunk) => {
                rawData = rawData + chunk;
            }).on('end', () => {
                const decoded = decodeURIComponent(rawData);
                console.info('[' + now + ']投稿: ' + decoded);
                const ans = qs.parse(decoded);
                res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
                    ans['name'] + 'さんは' + ans['favorite'] +
                    'に投票しました</h1></body></html>');
                res.end();
            });
            break;
        default:
            break;
    }
}).on('error', e => {
    console.error('[' + new Date() + '] Server error', e)
}).on('clientError', e => {
    console.error('[' + new Date() + '] Client error', e)
});

const port = 8000;
server.listen(port, () => {
    console.log('listening on ' + port)
});