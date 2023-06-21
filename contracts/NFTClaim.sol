// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTClaim is Ownable {
    mapping(address => uint256) public tokenBalances;
    mapping(uint8 => mapping(uint256 => bool)) public frinedsClaimed;
    mapping(uint8 => mapping(uint256 => bool)) public monstersClaimed;

    event TokensClaimed(address indexed user, uint256 tokensAmount);

    mapping(uint8 => uint256) fundingTime;
    

    function resetClaim() private onlyOwner {
        
    }
    constructor(address _braqTokenContract) {
        tokenContract = BraqToken(_braqTokenContract);

        fundingTime[1] = 1688137200;
        fundingTime[2] = 1696086000;
        fundingTime[3] = 1704034800;
        fundingTime[4] = 1711897200;
    }

    modifier onlyNotClaimedMonsters() {
       (!monstersClaimed[tokenId], "This BraqMonster is already claimed");
        _;
    }

    modifier onlyNotClaimedFriends() {
       (!friendsClaimed[tokenId], "This BraqFriend is already claimed");
        _;
    }

    function claimTokens() external onlyNotClaimed {
        // Perform the necessary validation of the user's NFT ownership before proceeding
        // ...

        // Calculate the number of tokens to distribute based on the NFT
        uint256 tokensAmount = calculateTokensAmount();

        // Perform the token distribution
        tokenBalances[msg.sender] = tokensAmount;

        // Mark the NFT as claimed
        claimed[msg.sender] = true;

        emit TokensClaimed(msg.sender, tokensAmount);
    }

    function calculateTokensAmount() internal pure returns (uint256) {
        // Implement the logic to calculate the number of tokens to distribute based on the NFT
        // ...

        // For example, you can return a fixed amount or calculate it based on the NFT's metadata.
        return 100; // Change this to your desired token amount
    }

    function withdrawTokens(uint256 amount) external {
        require(tokenBalances[msg.sender] >= amount, "Insufficient token balance");
        tokenBalances[msg.sender] -= amount;
        // Perform the token transfer to the user's wallet
        // ...
    }

    function setIssuer(address newIssuer) external onlyIssuer {
        issuer = newIssuer;
    }
}
