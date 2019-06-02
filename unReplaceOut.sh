#! /bin/bash
rm -rf node_modules/app-builder-lib/out
cp -R appBuilderLibTemp node_modules/app-builder-lib/out

rm -rf node_modules/dmg-builder/out
cp -R dmgBuilderTemp node_modules/dmg-builder/out
