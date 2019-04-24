pragma solidity ^0.5.7;

import "./VoluntaryCarbonUnit.sol";
import "./third-party/strings.sol";
import "./VoluntaryCarbonUnitData.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract CarbonShop is ReentrancyGuard {

    VoluntaryCarbonUnit private vcu;
    uint256 public exchangeRate;

    mapping(uint256 => bool) public isForSale;
    uint256[] public inventory;

    constructor(address _vcuAddress, uint256 _exchangeRate) public {
        vcu = VoluntaryCarbonUnit(_vcuAddress);
        exchangeRate = _exchangeRate;
    }

    // Buy using a wallet
    // solhint-disable-next-line no-complex-fallback
    function() external payable nonReentrant {
        // Find a suitable VCU
        (bool canSellSomething, uint256 tokenIdOfThing, uint256 consideration) = findVcuForAmount(msg.value);

        // Transfer it
        if (canSellSomething) {
            address sellerAddress = vcu.ownerOf(tokenIdOfThing);
            vcu.safeTransferFrom(sellerAddress, msg.sender, tokenIdOfThing);
            isForSale[tokenIdOfThing] = false;

            // Re-imburse the owner
            // Note: Probably better to use W-ETH for everything and not handle raw ether...
            address payable sellerAddressPayable = address(uint160(sellerAddress));
            sellerAddressPayable.transfer(consideration);
        }

        // Return the change
        uint256 change = msg.value - consideration;
        if (0 != change) {
            msg.sender.transfer(change);
        }
    }

    function listVcu(uint tokenId) public {
        require(msg.sender == vcu.ownerOf(tokenId), "Need ownership to list.");
        require(address(this) == vcu.getApproved(tokenId), "Need to grant approval before listing.");
 
        // Record that it is for sale
        isForSale[tokenId] = true;

        // Add to inventory
        inventory.push(tokenId);
    }

    function findVcuForAmount(uint256 amount) internal view returns (bool, uint256, uint256) {
        for (uint256 i = 0; i < inventory.length; i++) {
            uint256 tokenId = inventory[i];
            if (isForSale[tokenId]) {
                uint256 ethValueOfVcu = vcu.getQuantityIssued(tokenId) * exchangeRate;
                if (ethValueOfVcu <= amount) {
                    return (true, tokenId, ethValueOfVcu);
                }
            }
        }

        return (false, 0, 0);
    }
}