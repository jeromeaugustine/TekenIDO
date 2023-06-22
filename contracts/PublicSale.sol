// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

contract BraqPublicSale is Ownable {
    bool publicSaleStarted = false;
    address private BraqTokenContractAddress;
    IERC20 private BraqTokenInstance;
    bytes32 public merkleRoot;
    bytes32[] private merkleProof;
    uint256 public publicSaleSupply = 3750000;

    constructor(
        address _BraqTokenContractAddress, 
        bytes32 _merkleRoot,
        bytes32[] memory _merkleProof
        ) {
        BraqTokenContractAddress = _BraqTokenContractAddress;
        BraqTokenInstance = IERC20(_BraqTokenContractAddress);
        merkleRoot = _merkleRoot;
        merkleProof = _merkleProof;
        }

    function startPublicSale() external onlyOwner{
        publicSaleStarted = true;
    }

    function publicSale() public payable {
        require(publicSaleStarted, "Public Sale not started yet!");
        //uint256 EthAmount = msg.value / 10 ** 18;
        uint256 BraqAmount = msg.value / (5 * 10 ** 13);
        if (BraqAmount < 499) {
            revert("Error: Too small amount for purchase");
        }
        if (BraqAmount > publicSaleSupply) {
            revert("Error: Too big amount for purchase");
        }
        BraqTokenInstance.transfer(msg.sender, BraqAmount * 10 ** 18);
        publicSaleSupply -= BraqAmount;
    }

    function withdraw(uint256 amount) external onlyOwner { // Amount in wei
        require(address(this).balance > amount , "Insufficient contract balance");
        // Transfer ETH to the caller
        payable(msg.sender).transfer(amount);
    }

}

