const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

module.exports = (deployer, network) => {
  console.log(`## ${network} network ##`);
  deployer.deploy(VoluntaryCarbonUnit);
};
