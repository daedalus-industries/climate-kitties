/* eslint-disable consistent-return */
/* eslint-disable no-console */

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const Web3 = require('web3');
const contract = require('truffle-contract');

// returns a window with a document and an svg root node
const window = require('svgdom');
const SVG = require('svg.js')(window);
const document = window.document;

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
    description: details.methodology,
    external_url: 'https://openseacreatures.io/3',
    image: 'https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png',
    name: details.name,
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

app.get('/favicon.ico', (request, response) => {
  response.status(404).send("Sorry can't find that!");
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
