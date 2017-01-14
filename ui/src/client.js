import config from './config'
import Web3 from 'web3';

var client = new Web3(new Web3.providers.HttpProvider(config.url));
client.eth.defaultAccount = config.defaultAccount;

export default client