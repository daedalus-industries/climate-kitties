const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

module.exports = async (deployer, network, accounts) => {
  const vcu = await VoluntaryCarbonUnit.deployed();

  await vcu.mintVcu(
    accounts[0],
    Date.now(), // vintageStart
    Date.now() + (90 * 24 * 60 * 60 * 1000), // vintageEnd
    'Rick Sanchez',
    2, // countryCodeNumeric
    14, // sectoryScope
    'A method', // methodology
    1000, // totalVintageQuantity
    20, // quantityIssued
  );
};
