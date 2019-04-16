const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

// This should not be the same as the VCU contract creator, since that address will
// already be a minter and this script will fail.
const ADDRESS_OF_FIRST_MINTER = '0x9df24e73f40b2a911eb254a8825103723e13209c';

// eslint-disable-next-line no-unused-vars
module.exports = async (deployer) => {
  const vcu = await VoluntaryCarbonUnit.deployed();
  await vcu.addMinter('0x9df24e73f40b2a911eb254a8825103723e13209c');
  await vcu.addMinter('0x6D758C3A656869bbb9431b6c67E500d24a838959');

  console.log(" ### VoluntaryCarbonUnit contract deployed at", vcu.address);
};
