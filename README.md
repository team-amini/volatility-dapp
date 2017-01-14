# volatility-dapp

# Setup

## Node
Install [`node`](https://github.com/nodejs/node)

```shell
brew install nvm
nvm install 6
nvm use 6
```

## Truffle
Install [`truffle`](https://github.com/ConsenSys/truffle)

```shell
npm install -g truffle
```

## TestRPC
Install [`testrpc`](https://github.com/ethereumjs/testrpc)

*Note:* `testrpc` requires Node 6 as of this writing.

```shell
npm install -g ethereumjs-testrpc
```

# Running

Start testrpc and set low gasPrice:
```shell
testrpc --g 1
```

Configure address:
```shell
Copy default account and copy to ../ui-react/src/apps.js
```

Deploy contract:
```shell
cd ethereum-backend
truffle compile
truffle migrate
truffle console
```

Copy address to `../ui-react/src/apps.js`:
```
> Volatility.deployed().contract.address
```

Copy the ABI to `../ui-react/src/apps.js`:
```
> JSON.stringify(Volatility.deployed().abi)
```

Build app and run:
```shell
cd ui-react && npm install && npm start
```

View the app:
```shell
open http://localhost:3000/
```

# Testing

First make sure testrpc is running.

Next execute:

```shell
truffle test test/volatility.js
```
