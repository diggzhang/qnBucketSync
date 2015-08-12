/**
 *  use for qiniu bucket sync
 *  diggzhang@gmail.com 2015/07/30
 *
 *  first of all, you need create a file named 'config.js'
 *  at base location like this:
 *  .
 *  ├── package.json
 *  ├── qiniu.js
 *  └── config.js
 *
 * */

var qiniu = require('qiniu');
var wget = require('wget-improved');
var async = require('async');
var config = require('./config');


/*
*   qn configure
*   qiniu.conf.ACCESS_KEY = '<your access key>';
*   qiniu.conf.SECRET_KEY = '<your secret key>';
*   bucketName = 'your bucket name';
*   marker = null;   default config is null, use for server callback
*   limit = 99999;   limit of source list
* */
qiniu.conf.ACCESS_KEY = config.access_key;
qiniu.conf.SECRET_KEY = config.secret_key;
var bucketName = config.bucket_name;
var marker = null;
var limit = 5;
var baseUrl = config.baseUrl;

/*
*   get bucket list then down them all
*
*   list resourse list from bucket:
*   qiniu.rsf.listPrefix(bucketname, prefix, marker, limit, function(err, ret) {} )
*
*/
qiniu.rsf.listPrefix(bucketName, '', marker, limit, function(err, ret) {

    if (!err) {
        var sourceUrl = "";
        var thread = 1;
        var download = null;
        var options = {};


        var q = async.queue(function (task, callback) {

            var output = './' +  task.key;
            sourceUrl = encodeURI(baseUrl + task.key);

            download = wget.download(sourceUrl, output, options);

            download.on('error', function (err) {
                console.log(err);
            });

            download.on('end', function (output) {
                console.log( output + ' ' + task.key);
                callback();
            });

            download.on('progress', function (progress) {
                //console.log(progress);
            });

        }, thread);

        q.drain = function () {
            console.log('all videos have been downloaded');
        };

        q.push(ret.items, function (err) {
            if (err) throw err;
        });

    } else {
        console.log(err);
    }
});
