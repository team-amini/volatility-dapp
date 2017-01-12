# volatility-dapp

* start testrpc and set low gasPrice
  * testrpc --g 1
  * copy default account and copy to ../ui-react/src/apps.js
* cd ethereum-backend
* truffle compile
* truffle migrate
* truffle console
  * >Volatility.deployed().contract
    * copy address to ../ui-react/src/apps.js
  * >JSON.stringify(Volatility.deployed().abi)
    * copy address to ../ui-react/src/apps.js
* cd ui-react && npm install && npm start

## testing
* truffle test test/volatility.js (make sure testrpc is running)
* tests the volatility contract
