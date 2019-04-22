pragma solidity ^0.5.7;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "./third-party/strings.sol";
import "./VoluntaryCarbonUnitData.sol";

contract VoluntaryCarbonUnit is ERC721Full, ERC721Mintable {

    event Retirement(
        uint256 indexed tokenId
    );

    using strings for *;

    mapping(uint256 => VoluntaryCarbonUnitData.VcuDetail) public vcuDetails;

    uint256 public lastId = 0;

    // solhint-disable-next-line no-empty-blocks
    constructor() public ERC721Full("Voluntary Carbon Unit Certificates", "VCU") {
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        string memory tokenIdString = tokenId.uint2str();
        strings.slice memory urlBuilder = "https://dsscm-metadata.appspot.com/metadata/".toSlice();
        urlBuilder = urlBuilder.concat(tokenIdString.toSlice()).toSlice();

        urlBuilder = urlBuilder.concat("?contractAddress=".toSlice()).toSlice();
        urlBuilder = urlBuilder.concat(uint256(address(this)).uint2str().toSlice()).toSlice();

        urlBuilder = urlBuilder.concat("&blocknum=".toSlice()).toSlice();
        return urlBuilder.concat(block.number.uint2str().toSlice());
    }

    // Yes, you should be able to pick this up from the struct. However this only works
    // with ABIv2 (and even then the strings confuse it).
    function getQuantityIssued(uint256 tokenId) public view returns (uint256) {
        return vcuDetails[tokenId].quantityIssued;
    }

    // solhint-disable-next-line no-unused-vars
    function mint(address to, uint256 tokenId) public onlyMinter returns (bool) {
        revert("Not implemented. Use mint(to, VcuDetail) instead.");
    }

    function retire(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Cannot retire another\u2019s VCU.");
        _retire(tokenId);
    }

    function isRetired(uint256 tokenId) public view returns (bool) {
        return 0 != vcuDetails[tokenId].retirementDate;
    }

    function approve(address to, uint256 tokenId) public {
        require(!isRetired(tokenId), "Retired VCUs are not transferable.");
        super.approve(to, tokenId);
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
        _mintVcu(
            to,
            vintageStart,
            vintageEnd,
            name,
            countryCodeNumeric,
            sectoryScope,
            methodology,
            totalVintageQuantity,
            quantityIssued,
            isNonNegotiable
        );
    }

    function mintNonNegotiableVcu(
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
        _mintVcu(
            to,
            vintageStart,
            vintageEnd,
            name,
            countryCodeNumeric,
            sectoryScope,
            methodology,
            totalVintageQuantity,
            quantityIssued,
            true // non-negotiable bit
        );
    }

    function _mintVcu(
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

    ) internal returns (bool) {

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

        emit Retirement(tokenId);
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
