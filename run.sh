#!/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/home/master/Scripts
export PATH
/usr/bin/node /home/pi/qnSync/qiniu.js
echo `date` + "Qn sync already" >> /home/pi/qnSync/push.log