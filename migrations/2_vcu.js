const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

module.exports = (deployer) => {
  deployer.deploy(VoluntaryCarbonUnit);
};
