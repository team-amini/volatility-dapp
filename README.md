# Volatility DApp

Simple React based DApp to demonstrate pushing external rates to a contract and calculating the volatility client side.

The project is made of 2 modules:

- [`ui`](ui) - the DApp
- [`contract`](contract) - the Ethereum contract

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
testrpc --gasLimit 1111115141592 -g 1  -m volatility --account='0xafb293409a8c87be6ca3ca2ff1fca89af95e5dcf0bcb15125786b43a080de122,0x1000000000000000'
```

Deploy contract:
```shell
cd contract
truffle compile
truffle migrate
```

Configure the app:
```shell
truffle exec info.js > ../ui/src/config.js
```

Build app and run:
```shell
cd ui && npm install && npm start
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
