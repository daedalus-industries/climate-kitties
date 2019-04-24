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
      true, // Non-negotiable
    );
  });

  it('recognises the VCU that was transferred into it', async () => {
    assert.equal(await shop.isForSale.call(1), false);
    await vcu.approve(shop.address, 1);
    await shop.listVcu(1);
    assert.equal(await shop.isForSale.call(1), true);
  });

  it('sells it and makes change', async () => {
    await vcu.approve(shop.address, 1);
    await shop.listVcu(1);
    const buyerInitialBalance = await web3.eth.getBalance(accounts[4]);
    const sellerInitialBalance = await web3.eth.getBalance(accounts[0], 'pending');
    const { receipt } = await shop.send(10e10, { from: accounts[4] });
    const { gasPrice } = await web3.eth.getTransaction(receipt.transactionHash);
    const buyerClosingBalance = await web3.eth.getBalance(accounts[4], 'pending');
    const sellerClosingBalance = await web3.eth.getBalance(accounts[0], 'pending');
    assert.equal(accounts[4], await vcu.ownerOf.call(1));
    assert.equal(
      true,
      (buyerInitialBalance - buyerClosingBalance) - (receipt.gasUsed * gasPrice) - 2e10 < 1e5,
    );
    assert.equal(true, sellerClosingBalance - sellerInitialBalance - 2e10 < 1e5);
  });

  it('does not sell it twice', async () => {
    await vcu.approve(shop.address, 1);
    await shop.listVcu(1);

    // First Sale
    await shop.send(10e10);
    assert.equal(accounts[0], await vcu.ownerOf.call(1));
    assert.equal(await shop.isForSale.call(1), false);

    // Second sale
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    const { receipt } = await shop.send(1e10);
    const { gasPrice } = await web3.eth.getTransaction(receipt.transactionHash);
    const closingBalance = await web3.eth.getBalance(accounts[0], 'pending');
    assert.equal(0, await web3.eth.getBalance(shop.address));
    assert.equal(
      true,
      (initialBalance - closingBalance) - (receipt.gasUsed * gasPrice) < 1e5,
    );
  });

  it('sends back inadequate sums', async () => {
    await vcu.approve(shop.address, 1);
    await shop.listVcu(1);

    const initialBalance = await web3.eth.getBalance(accounts[7]);
    const { receipt } = await shop.send(2e10 - 1, accounts[7]);
    const { gasPrice } = await web3.eth.getTransaction(receipt.transactionHash);
    const closingBalance = await web3.eth.getBalance(accounts[7], 'pending');
    assert.equal(accounts[0], await vcu.ownerOf.call(1));
    assert.equal(0, await web3.eth.getBalance(shop.address));
    assert.equal(
      true,
      (initialBalance - closingBalance) - (receipt.gasUsed * gasPrice) < 1e5,
    );
  });

  it('can sell a non-negotiable VCU using approvals', async () => {
    await vcu.approve(shop.address, 2);
    await shop.listVcu(2);

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    const { receipt } = await shop.send(10e10, { from: accounts[4] });
    const { gasPrice } = await web3.eth.getTransaction(receipt.transactionHash);
    const closingBalance = await web3.eth.getBalance(accounts[0], 'pending');
    assert.equal(
      true,
      (closingBalance - initialBalance) - (receipt.gasUsed * gasPrice) - 2e10 < 1e5,
    );
    assert.equal(accounts[4], await vcu.ownerOf.call(2));
    assert.equal(0, await web3.eth.getBalance(shop.address));

    assert.equal(true, await vcu.isRetired.call(2));
  });

  it('does a straight sale with the default shop set-up', async () => {
    const v = await VoluntaryCarbonUnit.deployed();
    const s = await CarbonShop.deployed();
    assert.equal((await v.balanceOf(accounts[3])).toNumber(), 0);
    await s.send(10e18, { from: accounts[3] });
    assert.equal((await v.balanceOf(accounts[3])).toNumber(), 1);
  });
});
