# Qiniu Bucket Sync

Getting Started
===============
## Step 1 Prepare Your Bucket *SECRET KEY* and *ACCESS KEY*

## Step 2 Configure key in config.js, you need create new one named this.

```js

    var config = {
        access_key : "dfasdfsdlfjsdlf;jasd",
        secret_key : "fsdfsadfasdfasfasfdsa",
        bucket_name : "fsfasdfas",
        baseUrl: "http://dsfsf.com/fdsfs/"
    };

    module.exports = config;

```

## Step 3 Configure wget in qiniu.js, be aware the output path

```js

    var download = null;
    var options = {};
    var output = './' + ret.items[i].key;

    // source uri
    sourceUrl = encodeURI(baseUrl + ret.items[i].key);

    // wget download
    download = wget.download(sourceUrl, output, options);

```

## Step 4 run it

```bash

    $npm install
    $node qiniu.js

```

## Step 5 Config run.sh for cron

```shell

    #!/bin/bash
    PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/home/master/Scripts
    export PATH
    /usr/bin/node /home/pi/qnSync/qiniu.js
    echo `date` + "Qn sync already" >> /home/pi/qnSync/push.log

```

## Step 6 crontab this task

```shell

    $ crontab -e
    0 12 * * 7 /home/pi/qnSync/run.sh

```
