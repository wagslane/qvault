#! /bin/bash
mv node_modules/electron-builder/out outTemp
rm -rf node_modules/electron-builder/out
cp -R replaceOut node_modules/electron-builder/out