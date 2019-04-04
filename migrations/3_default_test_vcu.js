const VoluntaryCarbonUnit = artifacts.require('./VoluntaryCarbonUnit.sol');

module.exports = async (deployer, network, accounts) => {
  const vcu = await VoluntaryCarbonUnit.deployed();

  const details = {
    id: 1,
    name: 'Rick Sanchez',

    issuanceDate: Date.now,
    retirementDate: 0,

    vintageStart: Date.now(),
    vintageEnd: Date.now() + (90 * 24 * 60 * 60 * 1000),

    methodology: 'A method',

    countryCodeNumeric: 2,
    sectoryScope: 14,
    totalVintageQuantity: 1000,
    quantityIssued: 120,

    additionalCertifications: [],
  };

  await vcu.mintVcuStruct(accounts[0], details);
};
