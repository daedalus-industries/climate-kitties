import VoluntaryCarbonUnit from "./contracts/VoluntaryCarbonUnit.json";

const options = {
  web3: {
    block: false,
  },
  contracts: [VoluntaryCarbonUnit],
  events: {
    VoluntaryCarbonUnit: ["Transfer", "Approval", "ApprovalForAll"]
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
