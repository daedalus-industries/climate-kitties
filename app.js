/* eslint-disable consistent-return */
/* eslint-disable no-console */

const express = require('express');
const exphbs = require('express-handlebars');

const Web3 = require('web3');
const contract = require('truffle-contract');

const globalLog = require('global-request-logger');

globalLog.initialize();

globalLog.on('success', (request, response) => {
  console.log('SUCCESS');
  console.log('Request', request);
  console.log('Response', response);
});

globalLog.on('error', (request, response) => {
  console.log('ERROR');
  console.log('Request', request);
  console.log('Response', response);
});

const app = express();
const port = 8080;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const VoluntaryCarbonUnit = require('./build/contracts/VoluntaryCarbonUnit.json');

// Ex. 'http://127.0.0.1:8545' '1554785162215';
const { RPC_URL, NETWORK_ID } = process.env;

const walletProvider = new Web3.providers.HttpProvider(RPC_URL);
const web3 = new Web3(walletProvider);

app.get('/', (request, response) => {
  response.json(walletProvider);
});

app.get('/metadata/:id', async (request, response) => {
  const vcu = contract(VoluntaryCarbonUnit);
  vcu.setProvider(web3.currentProvider);
  vcu.setNetwork(NETWORK_ID);

  const instance = await vcu.deployed();
  const details = await instance.vcuDetails.call(request.params.id);

  const attributes = [];
  [
    'id',
    'countryCodeNumeric',
    'totalVintageQuantity',
    'quantityIssued',
  ].forEach((field) => {
    attributes.push({
      trait_type: field,
      value: details[field],
    });
  });

  const erc721Metadata = {
    name: details.name,
    description: details.methodology,
    image: `https://dsccm-236701.appspot.com/images/${details.id}?name=${details.name}&totalVintageQuantity=${details.totalVintageQuantity}&quantityIssued=${details.quantityIssued}`,
    external_url: 'http://lestaricapital.com',
    attributes,
  };

  response.json(erc721Metadata);
});

app.get('/images/:id', (request, response) => {
  response.setHeader('content-type', 'image/svg+xml');
  response.render('vcu_badge', {
    layout: false, // Otherwise handlebars looks for a main template
    id: request.params.id,
    name: request.query.name,
    quantity: request.query.quantityIssued,
    vintageTotal: request.query.totalVintageQuantity,
  });
});

app.use('/static', express.static('public'));

app.get('/favicon.ico', (request, response) => {
  response.status(404).send("Sorry can't find that!");
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
