#! /bin/bash
if [ "$TRAVIS_OS_NAME" == osx ]; then
    yarn release
else
    docker run --rm -e GH_TOKEN WIN_CSC_LINK WIN_CSC_KEY_PASSWORD -v "${PWD}":/project -v ~/.cache/electron:/root/.cache/electron -v ~/.cache/electron-builder:/root/.cache/electron-builder electronuserland/builder:wine /bin/bash -c "yarn --link-duplicates --pure-lockfile && yarn release --linux --win"
fi
