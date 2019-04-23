import VoluntaryCarbonUnit from "./contracts/VoluntaryCarbonUnit.json";
import CarbonShop from "./contracts/CarbonShop.json";

const options = {
  web3: {
    block: false,
  },
  contracts: [VoluntaryCarbonUnit, CarbonShop],
  events: {
    VoluntaryCarbonUnit: ["Transfer", "Approval", "ApprovalForAll"]
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
