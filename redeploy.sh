#!/bin/sh

git pull --rebase

sudo docker image build -t ujjwalbhardwaj .

sudo docker stop $(sudo docker ps -a -q --filter ancestor=ujjwalbhardwaj --format="{{.ID}}")

sudo docker container run -it -p 443:3004 ujjwalbhardwaj
