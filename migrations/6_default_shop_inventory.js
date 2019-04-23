/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');
const CarbonShop = artifacts.require('./CarbonShop.sol');

// eslint-disable-next-line no-unused-vars
module.exports = async (deployer, network, accounts) => {
  const defaultAccount = accounts[0];

  const vcu = await VoluntaryCarbonUnit.deployed();
  const shop = await CarbonShop.deployed();

  let vcuIndex = (await vcu.lastId.call()).toNumber();
  vcuIndex++;
  for (let i = 0; i !== 8; i++) {
    await vcu.mintVcu(
      defaultAccount, // HDWallets do not use coinbase!
      Date.now() - (600 * 24 * 60 * 60 * 1000), // vintageStart
      Date.now() + (120 * 24 * 60 * 60 * 1000), // vintageEnd
      'Carbon Sequestration Tree',
      780, // countryCodeNumeric
      14, // sectoryScope
      'A method', // methodology
      981, // totalVintageQuantity
      50, // quantityIssued
      true, // Non-negotiable
    );
    await vcu.approve(shop.address, vcuIndex);
    await shop.listVcu(vcuIndex++);

    await vcu.mintVcu(
      defaultAccount,
      Date.now(), // vintageStart
      Date.now() + (90 * 24 * 60 * 60 * 1000), // vintageEnd
      'Savanna Conserve',
      404, // countryCodeNumeric
      14, // sectoryScope
      'Some jam', // methodology
      200, // totalVintageQuantity
      18, // quantityIssued
      true, // Non-negotiable
    );
    await vcu.approve(shop.address, vcuIndex);
    await shop.listVcu(vcuIndex++);

    await vcu.mintVcu(
      defaultAccount,
      Date.now(), // vintageStart
      Date.now() + (90 * 24 * 60 * 60 * 1000), // vintageEnd
      'Nomad Reforestation',
      417, // countryCodeNumeric
      14, // sectoryScope
      'Goat Trees', // methodology
      1000, // totalVintageQuantity
      20, // quantityIssued
      true, // Non-negotiable
    );
    await vcu.approve(shop.address, vcuIndex);
    await shop.listVcu(vcuIndex++);

    await vcu.mintVcu(
      defaultAccount,
      Date.now() - (90 * 24 * 60 * 60 * 1000), // vintageStart
      Date.now() + (121 * 24 * 60 * 60 * 1000), // vintageEnd
      'Blueberry fields forever',
      752, // countryCodeNumeric
      8, // sectoryScope
      'Carbon-absorbing blueberry', // methodology
      121, // totalVintageQuantity
      81, // quantityIssued
      true, // Non-negotiable
    );
    await vcu.approve(shop.address, vcuIndex);
    await shop.listVcu(vcuIndex++);
  }
};
