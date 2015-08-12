



/**
 * Created by ronfe on 15-8-12.
 */
var async = require('async');
var request = require('request');
var baseUrl = 'http://7xaw4c.com2.z0.glb.qiniucdn.com/';

var toDoList = [ { key: '一元一次不等式_2bI_不等式的基本概念再辨析.mp4',
    hash: 'lmar28ZrgbCnzh77lIvJ2u6c53wt',
    fsize: 9429191,
    mimeType: 'video/mp4',
    putTime: 14361673619113772 },
    { key: '一元一次不等式组_0_不等关系的引入.mp4',
        hash: 'lu-7W9nmdZ3J6hg-PKgxRnBoI2fw',
        fsize: 7407448,
        mimeType: 'video/mp4',
        putTime: 14361673659493862 },
    { key: '一元一次不等式组_1aI_不等关系和不等式.mp4',
        hash: 'lpb4dO91aeOYrshRghhaxca3Cdfs',
        fsize: 11811469,
        mimeType: 'video/mp4',
        putTime: 14361673701011488 },
    { key: '一元一次不等式组_2aI_不等式的解和解集.mp4',
        hash: 'lmqDKTx0UtlAtWK33hzrQQ1JJ5md',
        fsize: 17714140,
        mimeType: 'video/mp4',
        putTime: 14361673751654308 },
    { key: '一元一次不等式组_3aII_不等式的性质（下）.mp4',
        hash: 'lkoNoOSPi_GJrFm0xQTa4zngBvVU',
        fsize: 12960429,
        mimeType: 'video/mp4',
        putTime: 14361673794153876 } ];



var q = async.queue(function (task, callback) {
    var fullUrl = baseUrl + task.key;
    request.head(fullUrl)
        .on('response', function(res){
            console.log(res.headers);
        });
    callback();
}, 3);

q.drain = function() {
    console.log('all items have been processed');
};

q.push(toDoList, function (err) {
    console.log('finished processing item');
});