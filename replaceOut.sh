#! /bin/bash
mv node_modules/app-builder-lib/out appBuilderLibTemp
rm -rf node_modules/app-builder-lib/out
cp -R replaceOut node_modules/app-builder-lib/out

mv node_modules/dmg-builder/out dmgBuilderTemp
rm -rf node_modules/dmg-builder/out
cp -R replaceOut node_modules/dmg-builder/out
