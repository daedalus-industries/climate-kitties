const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

// eslint-disable-next-line no-unused-vars
module.exports = async (deployer) => {
  const vcu = await VoluntaryCarbonUnit.deployed();
  await vcu.addMinter('0x9df24e73f40b2a911eb254a8825103723e13209c');
};
