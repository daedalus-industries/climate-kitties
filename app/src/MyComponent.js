import React from "react";
import { drizzleConnect } from "drizzle-react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";
import PropTypes from "prop-types";

import logo from "./kitten.jpeg";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    drizzleState: state.drizzleState,
    contracts: state.contracts
  };
};

class MyComponent extends React.Component {

  render() {
    return <div className="App">
      <div>
        <img src={logo} alt="drizzle-logo" />
        <h1>VCU Alpha Minting Dashboard</h1>
        <p>Just so there's an interface. In the absence of Verra's input there's little point going beyond something this simple <span role="img" aria-label="shrug">🤷‍♀️</span></p>
      </div>

      <div className="section">
        <h2>Active Account</h2>
        <AccountData accountIndex="0" units="ether" precision="3" />
      </div>

      <div className="section">
        <h2>Voluntary Carbon Units</h2>
        <p>
          Here we have a form with custom, friendly labels. Also note the token
          symbol will not display a loading indicator. We've suppressed it with
          the <code>hideIndicator</code> prop because we know this variable is
          constant.
        </p>
        <h3><strong>VCU NFT Details</strong></h3>
        <p>
          <ContractData contract="VoluntaryCarbonUnit" method="name" hideIndicator />&nbsp;
          (<ContractData contract="VoluntaryCarbonUnit" method="symbol" hideIndicator />)
        </p>
        <p>
          <strong>My Balance: </strong>
          <ContractData
            contract="VoluntaryCarbonUnit"
            method="balanceOf"
            methodArgs={[this.props.accounts[0]]}
          />
        </p>
        <h3>Mint a non-negotiable VCU</h3>
        <p>(Remember that vintages need to end after they start.)</p>
        <ContractForm
          contract="VoluntaryCarbonUnit"
          method="mintNonNegotiableVcu"
          labels={[
            "to",
            "vintageStart",
            "vintageEnd",
            "name",
            "countryCodeNumeric",
            "sectoryScope",
            "methodology",
            "totalVintageQuantity",
            "quantityIssued",
          ]}
        />
        <h3>Mint a negotiable VCU</h3>
        <p>(Ignore the checkbox. It's broken and we've filed a bug with the UI library we're using.)</p>
        <ContractForm
          contract="VoluntaryCarbonUnit"
          method="mintVcu"
          labels={[
            "to",
            "vintageStart",
            "vintageEnd",
            "name",
            "countryCodeNumeric",
            "sectoryScope",
            "methodology",
            "totalVintageQuantity",
            "quantityIssued",
            "isNonNegotiable"
          ]}
        />
        <h3>Retire a VCU</h3>
        <p>If the VCU is non-negotiable, this will also happen the first time it is transferred.</p>
        <ContractForm
          contract="VoluntaryCarbonUnit"
          method="retire"
          labels={[
            "tokenId",
          ]}
        />
      </div>
    </div>
  };
};

MyComponent.contextTypes = {
  drizzle: PropTypes.object
};

export default drizzleConnect(MyComponent, mapStateToProps);