const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

// eslint-disable-next-line no-unused-vars
module.exports = async (deployer) => {
  const vcu = await VoluntaryCarbonUnit.deployed();
  await vcu.addMinter('0xa24491d6378e843D7fe84bf20C589cFc5aC77562');
  await vcu.addMinter('0x6D758C3A656869bbb9431b6c67E500d24a838959');
};
