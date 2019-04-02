/* eslint-disable consistent-return */
/* eslint-disable no-console */

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const Web3 = require('web3');

const contract = require('truffle-contract');

const VoluntaryCarbonUnit = require('./build/contracts/VoluntaryCarbonUnit.json');

const app = express();
const port = 3000;

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const NETWORK_ID = process.env.NETWORK_ID || '1554220853564';

const walletProvider = new Web3.providers.HttpProvider(RPC_URL);
const web3 = new Web3(walletProvider);

app.engine('.hbs', exphbs({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/:id', async (request, response) => {
  const vcu = contract(VoluntaryCarbonUnit);
  vcu.setProvider(web3.currentProvider);
  vcu.setNetwork(NETWORK_ID);
  const instance = await vcu.deployed();
  const details = await instance.vcuDetails.call(request.params.id);
  response.render('home', {
    object: details,
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
