var build = require('./truffle.js');

var config = {
    url: "http://" + build.rpc.host + ":" + build.rpc.port,
    defaultAccount: web3.eth.accounts[0],
    volatilityContractAddress: Volatility.deployed().contract.address,
    volatilityContractABI: Volatility.deployed().abi
}

console.log("export default " + JSON.stringify(config))

process.exit()