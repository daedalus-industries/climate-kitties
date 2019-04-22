pragma solidity ^0.5.7;

library VoluntaryCarbonUnitData {

    event Retirement(
        uint256 indexed tokenId
    );

    // Long-term, most if not all, of this should be in IPFS JSON
    // but staying on-chain makes things easy for now.
    // Also if anything is left on-chain, a more generic structure should be
    // used, in the style of EternalStorage contracts. 
    struct VcuDetail {
        uint256 id;

        uint256 issuanceDate; // Maybe as days?
        uint256 retirementDate; // Maybe as days?

        uint256 vintageStart;
        uint256 vintageEnd; // Is the end always known?

        string name;
        uint16 countryCodeNumeric; // See https://en.wikipedia.org/wiki/ISO_3166-1_numeric
        uint16 sectoryScope; // Turn me into an enum
        string methodology; // Are these actually numbers?
        uint64 totalVintageQuantity; // What is the actual range here?
        uint64 quantityIssued;

        bool isNonNegotiable;
    }

}