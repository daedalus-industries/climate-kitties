pragma solidity ^0.5.7;

import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "./VoluntaryCarbonUnit.sol";
import "./third-party/strings.sol";
import "./VoluntaryCarbonUnitData.sol";

contract CarbonShop is IERC721Receiver {

    bytes4 private constant ERC721_RECEIVED = 0x150b7a02;

    VoluntaryCarbonUnit private vcu;
    uint256 public exchangeRate;

    mapping(uint256 => bool) public isForSale;
    uint256[] public inventory;

    constructor(address _vcuAddress, uint256 _exchangeRate) public {
        vcu = VoluntaryCarbonUnit(_vcuAddress);
        exchangeRate = _exchangeRate;
    }

    // Buy using a wallet
    // TODO Some sort of re-entrancy guard
    // solhint-disable-next-line no-complex-fallback
    function() external payable {
        // Find a suitable VCU
        (bool canSellSomething, uint256 tokenIdOfThing, uint256 change) = findVcuForAmount(msg.value);

        // Transfer it
        if (canSellSomething) {
            vcu.safeTransferFrom(address(this), msg.sender, tokenIdOfThing);
            isForSale[tokenIdOfThing] = false;
        }

        // Return the change
        if (0 != change) {
            msg.sender.transfer(change);
        }
    }

    // solhint-disable-next-line no-unused-vars 
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4)
    {
        require(address(vcu) == address(vcu), "Only carbon for sale here.");

        // Record that it is for sale
        isForSale[tokenId] = true;

        // Add to inventory
        inventory.push(tokenId);

        return ERC721_RECEIVED;
    }

    function findVcuForAmount(uint256 amount) internal view returns (bool, uint256, uint256) {
        for (uint256 i = inventory.length - 1; i <= 0; i--) {
            uint256 tokenId = inventory[i];
            if (isForSale[tokenId]) {
                uint256 ethValueOfVcu = vcu.getQuantityIssued(tokenId) * exchangeRate;
                if (ethValueOfVcu <= amount) {
                    return (true, tokenId, amount - ethValueOfVcu);
                }
            }
        }

        return (false, 0, amount);
    }
}