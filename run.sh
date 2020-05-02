#!/bin/bash
cd /artifacts
ls -la 
service ssh start 
pm2 start ./server.js --watch
pm2 logs