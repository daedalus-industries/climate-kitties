import shouldFail from 'openzeppelin-test-helpers/src/shouldFail';

const VoluntaryCarbonUnit = artifacts.require('VoluntaryCarbonUnit');

contract('VoluntaryCarbonUnit', (accounts) => {
  let vcu;

  beforeEach(async () => {
    vcu = await VoluntaryCarbonUnit.deployed();
  });

  it('cannot make a VCU without details', async () => {
    await shouldFail(vcu.mint(accounts[0], 1));
  });

  it('makes a VCU with the right meta details', async () => {
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

    await vcu.safeTransferFrom(accounts[0], accounts[1], 2);
    assert.equal(accounts[1], await vcu.ownerOf.call(2));

    const returnedDetails = await vcu.vcuDetails.call(2);
    assert.equal('Rick Sanchez', returnedDetails.name);
  });
});
