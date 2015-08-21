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
 *  thread 5 17.937
 *  thread 1 49.803
 *
 *  todo: shell.js -> wget
 * */

var qiniu = require('qiniu');
var async = require('async');
var Task = require('shell-task');
var fs = require('fs');
var _ = require('lodash');
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
var limit = 3;
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
        var thread = 3;
        var download = null;
        var options = {};
        var downloadPath = './video/';

        var savedIn = [];       //already down
        var listToRead= [];     //read new list
        var downloadList = [];  //after compare need to down


        // 通过对比下载目录文件名以及从线上读取的文件列表判断有无新文件更新
        fs.readdir(downloadPath, function (err, list) {

            list.forEach(function (file) {
                savedIn.push(file);
            });
            console.log("已经下载了： " + savedIn);

            ret.items.forEach(function (file) {
                listToRead.push(file.key);
            });
            console.log("更新的列表： " + listToRead);

            downloadList = _.xor(savedIn, listToRead);
            console.log("需要去下载： " + downloadList);
            console.log("共需要去下载 " + downloadList.length + " 个文件");

            var q = async.queue(function (task, callback) {

                sourceUrl = (baseUrl + task);

                // .then('curl ' + sourceUrl + ' -o ' + downloadPath + task.toString() )
                new Task('echo trying to curl')
                    .then('curl ' + sourceUrl + ' -o ' + downloadPath + task.toString() )
                    .run(function(err, next) {
                        if(err) throw err;
                        callback();
                    });

            }, thread);

            q.drain = function () {
                console.log('all videos have been downloaded');
            };

            // 下载条目stack
            q.push(downloadList, function (err) {
                if (err) throw err;
            });
        });

    } else {
        console.log(err);
    }
});
