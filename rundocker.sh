#!/bin/bash
#check for argument and set the port
if [ -z "$1" ]; then
    port="8888"
fi

docker stop htag
docker rm htag

docker build . -t htag:latest
docker run -d -p "$port:80" --name htag htag
