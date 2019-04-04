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

  it('makes an NFT and moves it', async () => {
    const details = {
      id: 7,
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
    await vcu.safeTransferFrom(accounts[0], accounts[1], 7);
    assert.equal(accounts[1], await vcu.ownerOf.call(7));

    const returnedDetails = await vcu.vcuDetails.call(7);
    assert.equal('Rick Sanchez', returnedDetails.name);
  });
});
