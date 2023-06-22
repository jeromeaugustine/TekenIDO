// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BraqPublicSale is Ownable {
    bool publicSaleStarted = false;
    address private BraqTokenContractAddress;
    IERC20 private BraqTokenInstance;
    mapping(address => bool) public whitelist;
    
    uint256 public publicSaleSupply = 3750000;

    constructor(address _BraqTokenContractAddress) {
        BraqTokenContractAddress = _BraqTokenContractAddress;
        BraqTokenInstance = IERC20(_BraqTokenContractAddress);
        }

    function addToWhitelist(address[] calldata toAddAddresses) 
    external onlyOwner
    {
        for (uint i = 0; i < toAddAddresses.length; i++) {
            whitelist[toAddAddresses[i]] = true;
        }
    }

    function startPublicSale() external onlyOwner{
        publicSaleStarted = true;
    }

    function whitelistFunc() external view returns(string memory){
        require(whitelist[msg.sender], "NOT_IN_WHITELIST");
        return "In the WhiteList";
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

    function getTokenAddress() public view returns(address){
        return BraqTokenContractAddress;
    }
    function withdraw(uint256 amount) external onlyOwner { // Amount in wei
        require(address(this).balance > amount , "Insufficient contract balance");
        // Transfer ETH to the caller
        payable(msg.sender).transfer(amount);
    }

}

