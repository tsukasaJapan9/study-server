'use strict';

const pug = require('pug');
const Post = require('./post');
const util = require('./handler-util');
const Cookies = require('cookies');

const trackingIdKey = 'tracking_id';

function handle(req, res) {
    const cookies = new Cookies(req, res);
    addTrackingCookie(cookies);

    switch (req.method) {
        case 'GET':
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            Post.findAll().then((posts) => {
                res.end(pug.renderFile('./views/posts.pug', {posts: posts}));
            });
            console.info(
                `閲覧されました: user: ${req.user}, ` + 
                `trackingID: ${cookies.get(trackingIdKey)}, ` + 
                `remoteAddress: ${req.connection.remoteAddress}`
            );
            break;
        case 'POST':
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                const decoded = decodeURIComponent(body);
                const content = decoded.split('content=')[1];
                Post.create({
                    content: content,
                    trackingCookie: cookies.get(trackingIdKey),
                    postedBy: req.user
                }).then(() => {
                    handleRedirectPosts(req, res);
                });
            });
            break;
        default:
            break;
    }
}

function addTrackingCookie(cookies) {
    if (!cookies.get(trackingIdKey)) {
        const trakingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        const tommorrow = new Date(Date.now() + (1000 * 60 * 60 * 24));
        cookies.set(trackingIdKey, trakingId, {expires: tommorrow});
    }
}

function handleRedirectPosts(req, res) {
    res.writeHead(303, {
        'Location': '/posts'
    });
    res.end();
}

module.exports = {
    handle
};