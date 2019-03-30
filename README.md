# Q Vault

Q Vault is an open source secret manager. As such, feel free to contribute to the project or raise issues using the "issues" tab on github.

## Contact

The best way to get in contact with the developers is on the public discord server.

Discord: [https://discord.gg/EEkFwbv](https://discord.gg/EEkFwbv)

Twitter: [https://twitter.com/q_vault](https://twitter.com/q_vault)

Facebook: [https://www.facebook.com/qvault](https://www.facebook.com/qvault)

Instagram: [https://www.instagram.com/qvault.io](https://www.instagram.com/qvault.io)

## License

[CC0 1.0 (Public Domain)](LICENSE.md)

## Linting

Q Vault uses eslint and all pull requests must pass the eslint tests specified in travis.yml.
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

It may give warnings about not being able to push to github. Ignore
these warning as you are just building for yourself.

```bash
yarn release
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
            "language": "html",
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
