'use strict';

const pug = require('pug');
const Post = require('./post');
const util = require('./handler-util');
const Cookies = require('cookies');
const crypto = require('crypto');

const trackingIdKey = 'tracking_id';

function handle(req, res) {
    const cookies = new Cookies(req, res);
    const trackingId = addTrackingCookie(cookies, req.user);

    switch (req.method) {
        case 'GET':
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            Post.findAll().then((posts) => {
                res.end(pug.renderFile('./views/posts.pug', {
                    posts: posts,
                    user: req.user
                }));
            });
            console.info(
                `閲覧されました: user: ${req.user}, ` + 
                `trackingID: ${trackingId}, ` + 
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
                    trackingCookie: trackingId,
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

function handleDelete(req, res) {
    switch (req.method) {
      case 'POST':
        let body = [];
        req.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          body = Buffer.concat(body).toString();
          const decoded = decodeURIComponent(body);
          const id = decoded.split('id=')[1];
          console.log(id)
          Post.findByPk(id).then((post) => {
            if (req.user === post.postedBy) {
              post.destroy().then(() => {
                handleRedirectPosts(req, res);
              });
            }
          });
        });
        break;
      default:
        util.handleBadRequest(req, res);
        break;
    }
  }

/**
 * Cookieに含まれているトラッキングIDに異常がなければその値を返し、
 * 存在しない場合や異常なものである場合には、再度作成しCookieに付与してその値を返す
 * @param {Cookies} cookies
 * @param {String} userName
 * @return {String} トラッキングID
 */
function addTrackingCookie(cookies, userName) {
    const requestedTrackingId = cookies.get(trackingIdKey);
    if (isValidTrackingId(requestedTrackingId, userName)) {
      return requestedTrackingId;
    } else {
      const originalId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      const tomorrow = new Date(Date.now() + (1000 * 60 * 60 * 24));
      const trackingId = originalId + '_' + createValidHash(originalId, userName);
      cookies.set(trackingIdKey, trackingId, { expires: tomorrow });
      return trackingId;
    }
  }
  
  function isValidTrackingId(trackingId, userName) {
    if (!trackingId) {
      return false;
    }
    const splitted = trackingId.split('_');
    const originalId = splitted[0];
    const requestedHash = splitted[1];
    return createValidHash(originalId, userName) === requestedHash;
  }
  
  function createValidHash(originalId, userName) {
    const sha1sum = crypto.createHash('sha1');
    sha1sum.update(originalId + userName);
    return sha1sum.digest('hex');
  }
  

function handleRedirectPosts(req, res) {
    res.writeHead(303, {
        'Location': '/posts'
    });
    res.end();
}

module.exports = {
    handle,
    handleDelete
};