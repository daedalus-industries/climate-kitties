const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');
const CarbonShop = artifacts.require('./CarbonShop.sol');

// eslint-disable-next-line no-unused-vars
module.exports = async (deployer) => {
  const vcu = await VoluntaryCarbonUnit.deployed();

  await vcu.mintVcu(
    CarbonShop.address,
    Date.now(), // vintageStart
    Date.now() + (90 * 24 * 60 * 60 * 1000), // vintageEnd
    'Rick Sanchez',
    2, // countryCodeNumeric
    14, // sectoryScope
    'A method', // methodology
    1000, // totalVintageQuantity
    20, // quantityIssued
    false, // Non-negotiable
  );
};
