import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";

import logo from "./kitten.jpeg";

export default ({ accounts }) => (
  <div className="App">
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>Climate Kitties Alpha Dashboard</h1>
      <p>Just so there's an interface. In the absence of Verra's input there's little point going beyond this <span role="img" aria-label="shrug">🤷‍♀️</span></p>
    </div>

    <div className="section">
      <h2>Active Account</h2>
      <AccountData accountIndex="0" units="ether" precision="3" />
    </div>

    <div className="section">
      <h2>Voluntary Carbon Credit</h2>
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
          methodArgs={[accounts[0]]}
        />
      </p>
      <h3>Mint a Climate Kitten  W00t!</h3>
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
          "dditionalCertifications"
        ]}
      />
      <h3>Send Climate Kitten</h3>
      <ContractForm
        contract="VoluntaryCarbonUnit"
        method="safeTransferFrom"
        labels={["From Address", "To Address", "Kittie Id"]}
      />
    </div>
    <div className="section">
      <h2>Climate Kittie Number 1</h2>
      <p>
        Let's just pull the first Climate Kittie to show we can.
        Note in the code the strings below are converted from bytes to UTF-8
        strings and the device data struct is iterated as a list.
      </p>
      <p>
        <ContractData contract="VoluntaryCarbonUnit" method="vcuDetails" methodArgs={[1]} />
      </p>
    </div>
  </div>
);
