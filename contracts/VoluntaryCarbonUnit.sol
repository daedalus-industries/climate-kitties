pragma solidity ^0.5.7;
pragma experimental ABIEncoderV2; // Before launch, replace if V2 not production 

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
 
contract VoluntaryCarbonUnit is ERC721Full, ERC721Mintable {

    // Long-term, most if not all, of this should be in IPFS JSON
    // but staying on-chain makes things easy for now.
    // Also if anything is left on-chain, a more generic structure should be
    // used, in the style of EternalStorage contracts. 
    struct VcuDetail {
        uint32 id;

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
    }

    mapping(uint32 => VcuDetail) public vcuDetails;

    uint32 public lastId = 0;

    // solhint-disable-next-line no-empty-blocks
    constructor() public ERC721Full("Voluntary Carbon Unit Certificates", "VCU") {
    }

    // solhint-disable-next-line no-unused-vars
    function mint(address to, uint256 tokenId) public onlyMinter returns (bool) {
        revert("Not implemented. Use mint(to, VcuDetail) instead.");
    }

    function mintVcu(
        address to,

        uint256 vintageStart,
        uint256 vintageEnd,

        string memory name,
        uint16 countryCodeNumeric,
        uint16 sectoryScope,
        string memory methodology,
        uint64 totalVintageQuantity,
        uint64 quantityIssued

    ) public onlyMinter returns (bool) {
        VcuDetail memory detail;

        detail.id = ++lastId;

        // solhint-disable-next-line not-rely-on-time
        detail.issuanceDate = now;
        detail.retirementDate = 0;

        detail.vintageStart = vintageStart;
        detail.vintageEnd = vintageEnd;

        detail.name = name;
        detail.countryCodeNumeric = countryCodeNumeric;
        detail.sectoryScope = sectoryScope;
        detail.methodology = methodology;
        detail.totalVintageQuantity = totalVintageQuantity;
        detail.quantityIssued = quantityIssued;

        return mintVcuStruct(to, detail);
    }

    function mintVcuStruct(address to, VcuDetail memory detail) public onlyMinter returns (bool) {
        vcuDetails[detail.id] = detail;

        require(
            0 == detail.retirementDate || detail.issuanceDate <= detail.retirementDate,
            "Retirement must be after issuance."
        );
        require(detail.vintageStart <= detail.vintageEnd, "Vintage must end after start.");

        _mint(to, detail.id);
        return true;
    }
}
