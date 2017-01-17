import config from './config'
import client from './client'

export default client.eth.contract(config.contractABI).at(config.contractAddress);
