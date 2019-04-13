const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

// eslint-disable-next-line no-unused-vars
module.exports = async (deployer) => {
  const vcu = await VoluntaryCarbonUnit.deployed();
  await vcu.addMinter('0xb77d57f4959eafa0339424b83fcfaf9c15407461');
};
