const VoluntaryCarbonUnit = artifacts.require('VoluntaryCarbonUnit');
const CarbonShop = artifacts.require('CarbonShop');

contract('CarbonShop', (accounts) => {
  let vcu;
  let shop;

  beforeEach(async () => {
    vcu = await VoluntaryCarbonUnit.new();
    shop = await CarbonShop.new(vcu.address, 1e10);
    await vcu.mintVcu(
      accounts[0],
      Date.now(), // vintageStart
      Date.now() + (90 * 24 * 60 * 60 * 1000), // vintageEnd
      'Rick Sanchez',
      2, // countryCodeNumeric
      14, // sectoryScope
      'A method', // methodology
      1000, // totalVintageQuantity
      2, // quantityIssued
      false, // Non-negotiable
    );

    await vcu.safeTransferFrom(accounts[0], shop.address, 1);
  });

  it('recognises the VCU that was minted into it', async () => {
    assert.equal(await shop.isForSale.call(1), true);
  });

  it('sells it and makes change', async () => {
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    const { receipt } = await shop.send(10e10);
    const { gasPrice } = await web3.eth.getTransaction(receipt.transactionHash);
    const closingBalance = await web3.eth.getBalance(accounts[0], 'pending');
    assert.equal(accounts[0], await vcu.ownerOf.call(1));
    assert.equal(2e10, await web3.eth.getBalance(shop.address));
    assert.equal(2e10 + (receipt.gasUsed * gasPrice), initialBalance - closingBalance);
  });

  it('does not sell it twice', async () => {
    // First Sale
    await shop.send(10e10);
    assert.equal(accounts[0], await vcu.ownerOf.call(1));
    assert.equal(2e10, await web3.eth.getBalance(shop.address));
    assert.equal(await shop.isForSale.call(1), false);

    // Second sale
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    const { receipt } = await shop.send(1e10);
    const { gasPrice } = await web3.eth.getTransaction(receipt.transactionHash);
    const closingBalance = await web3.eth.getBalance(accounts[0], 'pending');
    assert.equal(2e10, await web3.eth.getBalance(shop.address));
    assert.equal(receipt.gasUsed * gasPrice, initialBalance - closingBalance);
  });

  it('sends back inadequate sums', async () => {
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    const { receipt } = await shop.send(2e10 - 1);
    const { gasPrice } = await web3.eth.getTransaction(receipt.transactionHash);
    const closingBalance = await web3.eth.getBalance(accounts[0], 'pending');
    assert.equal(shop.address, await vcu.ownerOf.call(1));
    assert.equal(0, await web3.eth.getBalance(shop.address));
    assert.equal(
      (receipt.gasUsed * gasPrice) + 6144 /** Mystery wei :) */,
      initialBalance - closingBalance,
    );
  });
});
