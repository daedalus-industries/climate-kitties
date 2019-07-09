import React, { Component } from "react";
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import "./App.css";
import MyContainer from "./MyContainer";
import VoluntaryCarbonUnit from "./contracts/VoluntaryCarbonUnit.json";
import CarbonShop from "./contracts/CarbonShop.json";

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


const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

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
