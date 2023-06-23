// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTClaim is Ownable {
    mapping(uint32 => mapping(uint8 => bool)) public friendsClaimed;
    mapping(uint32 => mapping(uint8 => bool)) public monstersClaimed;
    mapping(uint8 => uint256) fundingTime;
    event TokensClaimed(address indexed user, uint256 tokensAmount);

    address private BraqTokenContractAddress;
    IERC20 private BraqTokenInstance;

    function resetClaim() private onlyOwner {
        
    }
    constructor(address _tokenContract) {
        BraqTokenContractAddress = _tokenContract;
        BraqTokenInstance = IERC20(BraqTokenContractAddress);

        fundingTime[0] = block.timestamp;
        fundingTime[1] = 1688137200;
        fundingTime[2] = 1696086000;
        fundingTime[3] = 1704034800;
        fundingTime[4] = 1711897200;
    }

    // Both contracts have no more than 5000 tokens
    modifier onlyNotClaimedMonsters(uint32 tokenId, uint8 quarter) {
       (!monstersClaimed[tokenId][quarter], "This BraqMonster is already claimed");
        _;
    }

    modifier onlyNotClaimedFriends(uint32 tokenId, uint8 quarter) {
       (!friendsClaimed[tokenId][quarter], "This BraqFriend is already claimed");
        _;
    }

    function claimTokens() external {
        // Perform the necessary validation of the user's NFT ownership before proceeding
        // ...

        // Calculate the number of tokens to distribute based on the NFT
        uint256 tokensAmount = calculateTokensAmount();

        // Perform the token distribution
        

        // Mark the NFT as claimed

        emit TokensClaimed(msg.sender, tokensAmount);
    }

    function calculateTokensAmount() internal pure returns (uint256) {
        // Implement the logic to calculate the number of tokens to distribute based on the NFT
        // ...

        // For example, you can return a fixed amount or calculate it based on the NFT's metadata.
        return 100; // Change this to your desired token amount
    }

    function withdrawTokens(uint256 amount) external {
        //require(tokenBalances[msg.sender] >= amount, "Insufficient token balance");
        //tokenBalances[msg.sender] -= amount;

        // Perform the token transfer to the user's wallet
        // ...
    }

}
