const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');
const CarbonShop = artifacts.require('./CarbonShop.sol');

module.exports = (deployer) => {
  deployer.deploy(CarbonShop, VoluntaryCarbonUnit.address, 1);
};
