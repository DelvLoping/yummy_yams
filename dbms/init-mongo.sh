#!/bin/bash

#mongoimport --host mongo:27017 --username root --password foobar --db yummy-yams --collection pastries --authenticationDatabase=admin --file /usr/src/pastries.json --jsonArray

mongoimport --host ${MONGO_HOST:-mongo} --username ${MONGO_INITDB_ROOT_USERNAME} --password ${MONGO_INITDB_ROOT_PASSWORD} --db yummy-yams --collection pastries --authenticationDatabase=admin --file /usr/src/app/pastries.json --jsonArray