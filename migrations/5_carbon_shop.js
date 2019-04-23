const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');
const CarbonShop = artifacts.require('./CarbonShop.sol');

module.exports = (deployer) => {
  deployer.deploy(CarbonShop, VoluntaryCarbonUnit.address, web3.utils.toBN(1e16));
};
