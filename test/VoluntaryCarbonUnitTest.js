const VoluntaryCarbonUnit = artifacts.require('VoluntaryCarbonUnit');

contract('VoluntaryCarbonUnit', (accounts) => {
  let vcu;

  beforeEach(async () => {
    vcu = await VoluntaryCarbonUnit.deployed();
  });

  it('makes an NFT and moves it', async () => {
    await vcu.mint(accounts[0], 1);
    await vcu.safeTransferFrom(accounts[0], accounts[1], 1);
    assert.equal(accounts[1], await vcu.ownerOf.call(1));
  });
});
