import shouldFail from 'openzeppelin-test-helpers/src/shouldFail';
import expectEvent from 'openzeppelin-test-helpers/src/expectEvent';

const VoluntaryCarbonUnit = artifacts.require('VoluntaryCarbonUnit');

contract('VoluntaryCarbonUnit', (accounts) => {
  let vcu;

  beforeEach(async () => {
    vcu = await VoluntaryCarbonUnit.new();
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
      false, // Non-negotiable
    );
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
      false, // Non-negotiable
    );

    await vcu.safeTransferFrom(accounts[0], accounts[1], 2);
    assert.equal(accounts[1], await vcu.ownerOf.call(2));

    const returnedDetails = await vcu.vcuDetails.call(2);
    assert.equal('Rick Sanchez', returnedDetails.name);
  });

  it('can retired VCUs', async () => {
    const retireTx = await vcu.retire(1);
    expectEvent.inTransaction(retireTx.receipt.transactionHash, VoluntaryCarbonUnit, 'Retirement');

    await shouldFail(
      vcu.safeTransferFrom(accounts[0], accounts[1], 1),
      'Retired VCUs cannot be transfered',
    );
    await shouldFail(
      vcu.approve(accounts[0], 1),
      'Retired VCUs cannot be transfers cannot be approved.',
    );
  });

  it('auto-retires non-negotiable VCUs', async () => {
    await vcu.mintNonNegotiableVcu(
      accounts[0],
      Math.trunc(Date.now() / 1000), // vintageStart
      Math.trunc((Date.now() / 1000) + (90 * 24 * 60 * 60)), // vintageEnd
      'Rick Sanchez',
      2, // countryCodeNumeric
      14, // sectoryScope
      'A method', // methodology
      1000, // totalVintageQuantity
      20, // quantityIssued
    );

    await vcu.safeTransferFrom(accounts[0], accounts[1], 2);
    assert.equal(true, await vcu.isRetired.call(2), 'Automatically retired after transfer.');
  });
});
