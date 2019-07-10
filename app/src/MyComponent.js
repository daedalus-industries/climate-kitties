import React from "react";
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { newContextComponents } from "drizzle-react-components";

import logo from "./kitten.jpeg";

// I've removed this for now:
// import EthereumQRPlugin from 'ethereum-qr-code';


// const { AccountData, ContractData, ContractForm } = newContextComponents;
// const { drizzle, drizzleState } = this.props;


class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
//    const qr = new EthereumQRPlugin();
//    qr.toCanvas(
//      {to: this.props.drizzle.drizzleState.contracts.CarbonShop.address},
//      {selector: '#shop-qr-code',}
//    );
  }

  render() {
    // These being instantiated incorrectly might be a source of error:
    // const { AccountData, ContractData, ContractForm } = newContextComponents;
    // const { drizzle, drizzleState } = this.props;
// So this is the breakpoint, as far as I can tell. It should work.
    console.log(this.props.drizzle.drizzleState.contracts.VoluntaryCarbonUnit.address);
    // "cannot read property 'accounts' of undefined" :/
    return (
      <div className="App">
        <div>
          <img src={logo} alt="drizzle-logo" />
            <h1>VCU Alpha Minting Dashboard</h1>
          <p>Just so there's an interface. In the absence of Verra's input there's little point going beyond something this simple <span role="img" aria-label="shrug">🤷‍♀️</span></p>
        </div>

        <div className="section">
          <h2>Active Account</h2>

        </div>
      </div>
    );
  };
};

// Again, working backwards, eliminating everything to just
// see if the drizzle instance is starting properly.

//        <div className="section">
//          <h2>Voluntary Carbon Units</h2>
//          <p>
//            Here we have a form with custom, friendly labels. Also note the token
//            symbol will not display a loading indicator. We've suppressed it with
//            the <code>hideIndicator</code> prop because we know this variable is
//            constant.
//          </p>
//          <h3><strong>VCU NFT Details</strong></h3>
//          <p>
//            <ContractData contract="VoluntaryCarbonUnit" method="name" hideIndicator />&nbsp;
//            (<ContractData contract="VoluntaryCarbonUnit" method="symbol" hideIndicator />)
//          </p>
//          <p>
//            <strong>My Balance: </strong>
//            <ContractData
//              contract="VoluntaryCarbonUnit"
//              method="balanceOf"
//              methodArgs={drizzleState.accounts[0]}
//            />
//          </p>
//          <h3>Mint a non-negotiable VCU</h3>
//          <p>(Remember that vintages need to end after they start.)</p>
//          <ContractForm
//            contract="VoluntaryCarbonUnit"
//            method="mintNonNegotiableVcu"
//            labels={[
//              "to",
//              "vintageStart",
//              "vintageEnd",
//              "name",
//              "countryCodeNumeric",
//              "sectoryScope",
//              "methodology",
//              "totalVintageQuantity",
//              "quantityIssued",
//            ]}
//          />
//          <h3>Mint a negotiable VCU</h3>
//          <p>(Ignore the checkbox. It's broken and we've filed a bug with the UI library we're using.)</p>
//          <ContractForm
//            contract="VoluntaryCarbonUnit"
//            method="mintVcu"
//            labels={[
//              "to",
//              "vintageStart",
//              "vintageEnd",
//              "name",
//              "countryCodeNumeric",
//              "sectoryScope",
//              "methodology",
//              "totalVintageQuantity",
//              "quantityIssued",
//              "isNonNegotiable"
//            ]}
//          />
//          <h3>Retire a VCU</h3>
//          <p>If the VCU is non-negotiable, this will also happen the first time it is transferred.</p>
//          <ContractForm
//            contract="VoluntaryCarbonUnit"
//            method="retire"
//            labels={[
//              "tokenId",
//            ]}
//          />
//          <h3>VCU Shop</h3>
//          <p>Feeling guilty? Carbon footprint getting you down. Send ether to address below for instant absolution!</p>
//          // <p>{drizzle.contracts.CarbonShop.address}</p>
//          <div id="shop-qr-code" />
//         </div>

export default MyComponent;
