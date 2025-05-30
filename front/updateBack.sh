#!/usr/bin/env bash

#cp -r ./build/ ../nodeeweb-server/theme &&
rm -rf ../server/theme/* && cp -r ./build/ ../server/theme && rm -rf ../server/packages/server/theme/* && cp -r ./build/ ../server/packages/server/theme/
