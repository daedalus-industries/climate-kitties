pragma solidity ^0.5.7;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "./third-party/strings.sol";

contract VoluntaryCarbonUnit is ERC721Full, ERC721Mintable {

    using strings for *;

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

    mapping(uint256 => VcuDetail) public vcuDetails;

    uint256 public lastId = 0;

    // solhint-disable-next-line no-empty-blocks
    constructor() public ERC721Full("Voluntary Carbon Unit Certificates", "VCU") {
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        string memory tokenIdString = tokenId.uint2str();
        return
            "https://dsccm-236701.appspot.com/metadata/".toSlice()
            .concat(tokenIdString.toSlice());
    }

    // solhint-disable-next-line no-unused-vars
    function mint(address to, uint256 tokenId) public onlyMinter returns (bool) {
        revert("Not implemented. Use mint(to, VcuDetail) instead.");
    }

    function retire(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Cannot retire another\u2019s VCU.");
        _retire(tokenId);
    }

    function isRetired(uint256 tokenId) public returns (bool) {
        return 0 != vcuDetails[tokenId].retirementDate;
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
        uint64 quantityIssued,
        bool isNonNegotiable

    ) public onlyMinter returns (bool) {

        require(vintageStart <= vintageEnd, "Vintage must end after start.");

        uint256 id = ++lastId;
        vcuDetails[id].id = id;

        // solhint-disable-next-line not-rely-on-time
        vcuDetails[id].issuanceDate = now;
        vcuDetails[id].retirementDate = 0;

        vcuDetails[id].vintageStart = vintageStart;
        vcuDetails[id].vintageEnd = vintageEnd;

        vcuDetails[id].name = name;
        vcuDetails[id].countryCodeNumeric = countryCodeNumeric;
        vcuDetails[id].sectoryScope = sectoryScope;
        vcuDetails[id].methodology = methodology;
        vcuDetails[id].totalVintageQuantity = totalVintageQuantity;
        vcuDetails[id].quantityIssued = quantityIssued;

        vcuDetails[id].isNonNegotiable = isNonNegotiable;

        _mint(to, id);
        return true;
    }

    function _retire(uint256 tokenId) internal {
        require(!isRetired(tokenId), "Cannot retire retired VCU.");

        // solhint-disable-next-line not-rely-on-time
        vcuDetails[tokenId].retirementDate = now;
    }

    // Overriden from OpenZepplin ERC721.sol to implement retirement and non-negotability
    function _transferFrom(address from, address to, uint256 tokenId) internal {
        require(!isRetired(tokenId), "Retired VCUs are not transferable.");
        super._transferFrom(from, to, tokenId);

        if (vcuDetails[tokenId].isNonNegotiable) {
            _retire(tokenId);
        }
    }
}
