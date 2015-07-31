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
var limit = 2;

/*
*   get bucket list then down them all
*
*   list resourse list from bucket:
*   qiniu.rsf.listPrefix(bucketname, prefix, marker, limit, function(err, ret) {} )
*
*/
qiniu.rsf.listPrefix(bucketName, '', marker, limit, function(err, ret) {
    if (!err) {

        var i = 0;
        var baseUrl = config.baseUrl;
        var sourceUrl = "";

        for (i ; i < ret.items.length; i++) {

            //console.log(ret.items[i].key);
            /*
            *   wget config
            *   var output = 'source location at local';
            * */
            var download = null;
            var options = {};
            var output = './' + ret.items[i].key;

            // source uri
            sourceUrl = encodeURI(baseUrl + ret.items[i].key);

            // wget download
            download = wget.download(sourceUrl, output, options);

            // wget process info
            download.on('error', function (err) {
                console.log(err);
            });

            download.on('end', function (output) {
                console.log(output);
            });

            download.on('progress', function (progress) {
                console.log(progress);
            });
        };

    } else {
        console.log(err);
    }
});
