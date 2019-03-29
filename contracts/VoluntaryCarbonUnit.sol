pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
 
contract VoluntaryCarbonUnit is ERC721Full, ERC721Mintable {
    // solhint-disable-next-line no-empty-blocks
    constructor() public ERC721Full("Voluntary Carbon Unit Certificates", "VCU") {
    }
}
