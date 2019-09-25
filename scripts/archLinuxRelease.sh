#! /bin/bash

# Arch-linux users are expected to already have a global electron installation
# that we want to use instead of re-downloading our own
# we will configure electron-builder to use the local version
# and not to download electron

node << EOF

const pjson = require('../package.json');
const fs = require('fs');

const newPjson = JSON.parse(JSON.stringify(pjson));

newPjson.build.electronDist = '/usr/lib/electron';
delete newPjson.devDependencies.electron;

fs.writeFileSync('../package.json', JSON.stringify(newPjson, null, 2));
fs.writeFileSync('../package-old.json', JSON.stringify(pjson, null, 2) + '\n');

EOF

cp ../yarn.lock ../yarn-old.lock

yarn install

yarn release -l dir -c.electronVersion

mv ../package-old.json ../package.json
mv ../yarn-old.lock ../yarn.lock
