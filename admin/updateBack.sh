#!/usr/bin/env bash

#cp -r ./build/ ../nodeeweb-server/theme &&
rm -rf ../server/admin/* && cp -r ./build/ ../server/admin && rm -rf ../server/packages/server/admin/* && cp -r ./build/ ../server/packages/server/admin
