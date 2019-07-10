import React from "react";
import MyComponent from './MyComponent';
import { DrizzleContext } from "drizzle-react";

// This is one potential sources of error I suppose
// As per the examples, this pattern makes the drizzle instance available
// to any returned child components, passing them into the component as props.
export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        return "Loading...";
      }

      return (
        <MyComponent drizzle={drizzle} drizzleState={drizzleState} />
      );
    }}
  </DrizzleContext.Consumer>
)
