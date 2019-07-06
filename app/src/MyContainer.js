import MyComponent from './MyComponent';
import { drizzleConnect } from "drizzle-react";

const mapStateToProps = state => ({
    accounts: state.accounts,
    VoluntaryCarbonUnit: state.contracts.VoluntaryCarbonUnit,
    CarbonShop: state.contracts.CarbonShop,
    drizzleStatus: state.drizzleStatus,
  });

const MyContainer = drizzleConnect(
  MyComponent,
  mapStateToProps
);

export default MyContainer;
