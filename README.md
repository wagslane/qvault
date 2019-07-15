# Qvault

An open source, fully transparent and extremely secure password manager

https://qvault.io

[![Build Status](https://img.shields.io/travis/q-vault/qvault/master.svg?logo=travis&label=Build)](https://travis-ci.org/Q-Vault/qvault)

[![Github All Releases](https://img.shields.io/github/downloads/q-vault/qvault/total.svg?logo=github&label=Downloads)](https://github.com/Q-Vault/qvault/releases)

[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/q-vault/qvault.svg?logo=snyk&label=Vulnerabilities)](https://snyk.io/test/github/q-vault/qvault)

## Contact

[![Twitter Follow](https://img.shields.io/twitter/follow/q_vault.svg?label=Follow%20Qvault&style=social)](https://twitter.com/intent/follow?screen_name=q_vault)

[![Discord Chat](https://img.shields.io/badge/Discord-Chat-blue.svg?logo=discord&logoColor=white)](https://discord.gg/EEkFwbv)

[![Medium](https://img.shields.io/badge/Medium-Publication-blueviolet.svg?logo=medium)](https://medium.com/qvault)

## Features

* Optional two factor encryption using physical Qvault cards (QR code contains a key that is scanned with a webcam to unlock vault)
* Optional recovery code stored on Qvault card in case master password is forgotten
* Free optional cloud backup storage. All encrypted vaults are stored locally in a ".qvault" file, and the same encrypted file can be stored on our servers.
* Can be used offline
* Virtual keyboard to bypass keylogger malware
* Import passwords from a CSV (most browsers can export to CSV)
* Don't trust, verify! Open source is the only way secret managers should be
* Windows, Mac and Linux
* All windows and mac releases are code signed and updates are optional (prompted) within the app

<p align="center">
    <img src="doc_resources/crypto.png" alt="cryptocurrency bitcoin password manager">
</p>

## Contact

The best way to get in contact with the developers is on the public discord server.

[![Discord Chat](https://img.shields.io/badge/Discord-Chat-blue.svg?logo=discord&logoColor=white)](https://discord.gg/EEkFwbv)

## License

[MIT License](LICENSE)

## Linting

Qvault uses eslint and all pull requests must pass the eslint tests specified in travis.yml.
To run the linting tests:

```bash
yarn lint
```

To try to autofix the repo:

```bash
yarn lint-fix
```

## Node Version

Set the correct node version:

```bash
nvm use
```

## Run Tests

Mocha Chai

```bash
yarn test
```

## Run in development mode

```bash
yarn dev
```

## Build from source

```bash
yarn release --publish never
```

## Contributing

Feel free to contribute by forking the repo and opening pull requests. Please ensure that your code passes the existing tests, and write tests to test your changes if applicable.

We also use eslint, so make sure your code adheres to the rules defined in [.eslintrc.json](.eslintrc.json)

All pull requests should be submitted to the "master" branch. Code in the "prod" branch is live in the latest release.

## Recommended VS Code settings

```json
{
    "editor.formatOnSave": false,
    "files.eol": "\n",
    "eslint.validate": [
        {
            "language": "vue",
            "autoFix": true
        },
        {
            "language": "javascript",
            "autoFix": true
        }
    ],
    "eslint.autoFixOnSave": true
}
```
