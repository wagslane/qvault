# electron-quick-start

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)

## NVM

Set the correct node version:

```bash
nvm use
```

## {vault-name}.qvault file format

The file once written to disk will be a flat json file. Below the structure is described.

```javascript
{
	// required
	"username": "lane",
	// not required, a default is provided if this field is empty
	"avatar": "base64 png image",
	// The master key (128 bit random number) ciphered with a custom password
	// this CAN be blank if the user opts to use the card for each login
	"key": "fdafdgfgds9fd8f9hsfo",
	// All the secrets stored in this vault, each secret here is ciphered using
	// the user's key. each "secret object" is ciphered as a whole to keep descriptions
	// and tickers safe as well
	"secrets": {
		"cryptocurrency": {
			"uuid-333-555-3333":{
				// Optional, a list of cryptocurrencies this wallet holds
				"tickers": ["BTC", "ETH"],
				// optional, the name of the wallet software
				"wallet_software": "electrum",
				// Optional, a description of this secret
				"description": "Personal wallet",
				// The type of secret data, options are listed below
				"type": "mnemonic",
				// Optional, a pin the user uses to login to that wallet. Length 3-10
				"pin": 4334,
				// Optional, a passcode the user uses to unlock the wallet software length 5-25
				"password": "mywalletpassword",
				// Below is described each kind of secret type,
				// although only one "data" field will exist and will depend on "type"
				// mnemonic, an array of words between 2-12 characters each
				"secret": ["big, bounce, run, jump", "etc.."],
				// master_key, a single string of characters representing a key
				// 8-1024 characters
				"secret": "fjsdbflsdufgsjkdfsgdflsdfbsljhfdbjsdhfsdld",
				// key_list, an array of private keys
				"secret": ["fjsdbflsdufgsjkdfsgdflsdfbsljhfdbjsdhfsdld", "fsdaffgdfgdfgdffsdsddffi9238hb345u9brnr9r0"]
			},
		}
	},
	// Each child user object has the same structure as the base user object
	"children": [
		{
			// child key that was derived using the (hash(master + nonce0)),
			// then ciphered with a DIFFERENT custom password
			"key": "gkjsdkjmfoiewuer09",
			"children": [
				{
					// hash(child0 + nonce0)
					"key": "fdjgasdlfsdgfjkdfhg",
					"children": [
						// the children of this child, derived using the same pattern
					]
				}
			]
		},
		{
			// hash(master + nonce1)
			"key": "hdfgh5fg98d7g9dfg79",
			"children": [
				// the children of this child, derived using the same pattern
			]
		}
	]
}
```