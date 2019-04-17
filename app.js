/* eslint-disable consistent-return */
/* eslint-disable no-console */

const express = require('express');
const cacheControl = require('express-cache-controller');
const exphbs = require('express-handlebars');
const boolParser = require('express-query-boolean');

const Web3 = require('web3');
const contract = require('truffle-contract');

const lookup = require('country-code-lookup');
const date = require('date-and-time');

const globalLog = require('global-request-logger');

const MILLI = 1000;

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

// This is optional middleware I have to add myself? Seriously?
app.use(boolParser());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(cacheControl({
  noCache: true,
}));

const VoluntaryCarbonUnit = require('./build/contracts/VoluntaryCarbonUnit.json');

// Ex. 'http://127.0.0.1:8545' '1554785162215';
const { RPC_URL, NETWORK_ID } = process.env;

const walletProvider = new Web3.providers.HttpProvider(RPC_URL);
const web3 = new Web3(walletProvider);

app.get('/', (request, response) => {
  response.json(walletProvider);
});

app.use('/static', express.static('public'));

app.get('/metadata/:id', async (request, response) => {
  const vcu = contract(VoluntaryCarbonUnit);
  vcu.setProvider(web3.currentProvider);
  vcu.setNetwork(NETWORK_ID);

  const instance = await vcu.deployed();
  const details = await instance.vcuDetails.call(request.params.id);

  const attributes = [];
  [
    'id',
    'methodology',
  ].forEach((field) => {
    attributes.push({
      trait_type: field,
      value: details[field],
    });
  });

  attributes.push({
    trait_type: 'totalVintageQuantity',
    value: details.totalVintageQuantity.toNumber(),
  });

  attributes.push({
    trait_type: 'quantityIssued',
    value: details.quantityIssued.toNumber(),
  });

  const retirementTimestamp = details.retirementDate.toNumber() * MILLI;
  const isRetired = retirementTimestamp !== 0;

  if (isRetired) {
    const retirementDateText = date.format(new Date(retirementTimestamp), 'YYYY-MM-DD HH:mm:ss', true);
    attributes.push({
      trait_type: 'retirementDate',
      value: retirementDateText,
    });
  }

  const issuanceTimestamp = details.issuanceDate.toNumber() * MILLI;
  if (issuanceTimestamp !== 0) {
    const issuanceDateText = date.format(new Date(issuanceTimestamp), 'YYYY-MM-DD HH:mm:ss', true);
    attributes.push({
      trait_type: 'issuanceDate',
      value: issuanceDateText,
    });
  }

  const country = lookup.byIso(details.countryCodeNumeric);
  const countryName = country ? country.country : details.countryCodeNumeric;

  attributes.push({
    trait_type: 'country',
    value: countryName,
  });

  const erc721Metadata = {
    name: details.name,
    description: details.methodology,
    image: `https://dsscm-metadata.appspot.com/images/${details.id}?name=${details.name}&totalVintageQuantity=${details.totalVintageQuantity}&quantityIssued=${details.quantityIssued}&isRetired=${isRetired}`,
    external_url: 'http://lestaricapital.com',
    attributes,
  };

  response.json(erc721Metadata);
});

app.get('/images/:id', (request, response) => {
  response.setHeader('content-type', 'image/svg+xml');
  response.render('vcu_badge', {
    layout: false, // Otherwise handlebars looks for a main template

    // There's probably a way to shorten this
    id: request.params.id,
    name: request.query.name,
    quantity: request.query.quantityIssued,
    vintageTotal: request.query.totalVintageQuantity,
    isRetired: request.query.isRetired,
  });
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
