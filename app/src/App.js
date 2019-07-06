import React, { Component } from "react";
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";

import "./App.css";

import options from "./drizzleOptions";
import MyContainer from "./MyContainer";
import store from './middleware';

class App extends Component {
  render() {
    return (
      <DrizzleProvider store={store} options={options}>
        <LoadingContainer>
          <MyContainer />
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
