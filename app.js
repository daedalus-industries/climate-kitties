/* eslint-disable consistent-return */
/* eslint-disable no-console */

const express = require('express');

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

// returns a window with a document and an svg root node
const window = require('svgdom');
const SVG = require('svg.js')(window);

const { document } = window;

const VoluntaryCarbonUnit = require('./build/contracts/VoluntaryCarbonUnit.json');

const app = express();
const port = 8080;

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
    image: 'https://dsccm-236701.appspot.com/static/verified_carbon.svg',
    external_url: 'http://lestaricapital.com',
    attributes,
  };

  response.json(erc721Metadata);
});

// This may not be used initially, but it's a cool idea
app.get('/images/:id', (request, response) => {
  const canvas = SVG(document.documentElement);
  canvas
    .rect(30, 30)
    .fill('yellow')
    .move(5, 5);
  canvas.text(request.params.id);

  response.setHeader('content-type', 'image/svg+xml');
  response.status(200).send(canvas.svg());
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
