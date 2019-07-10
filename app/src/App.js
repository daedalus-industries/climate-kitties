import React, { Component } from "react";
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import "./App.css";
import MyContainer from "./MyContainer";
import VoluntaryCarbonUnit from "./contracts/VoluntaryCarbonUnit.json";
import CarbonShop from "./contracts/CarbonShop.json";


// Moved the options to avoid export errors?
// This is what the drizzleContext example looks like.
// Trying to remove all possible discrepancies and work backwards
const options = {
  web3: {
    block: false,
  },
  contracts: [VoluntaryCarbonUnit, CarbonShop],
  events: {
    VoluntaryCarbonUnit: ["Retirement", "Transfer", "Approval", "ApprovalForAll"]
  },
  polls: {
    accounts: 1500,
  },
};

// Originally the store was also imported, but again,
// Trying to keep things as close to the examples.
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

// Instead of using the provider as before
// the new drizzleContext.Provider accepts the drizzle instance
// and makes it available to all child components. 
class App extends Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
          <MyContainer />
      </DrizzleContext.Provider>
    );
  }
}

export default App;
