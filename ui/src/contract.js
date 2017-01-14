import config from './config'
import client from './client'

export default client.eth.contract(config.volatilityContractABI).at(config.volatilityContractAddress);
