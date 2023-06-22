// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

contract BraqToken is ERC20, Ownable {
    bool publicSaleStarted = false;
    uint256 public allowListSaleSupply = 10; // in braq tokens
    uint256 public publicSaleSupply = 3750000;
    bytes32 public merkleRoot;
    bytes32[] private merkleProof;
    mapping(address => bool) public admins;
    
    struct Pool {
        mapping(uint8 => bool) funded;
        mapping(uint8 => uint256) amountToFund; // In BraqTokens, multiply by decimals()
        address poolAddress;
    }

    enum Pools {
        Ecosystem,
        Rewards,
        Incentives,
        Listings,
        Private,
        Team,
        Marketing
    }
    mapping(Pools => Pool) public pools;
    mapping(uint8 => uint256) fundingTime;

    // Modifier to restrict access to admins only
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function.");
        _;
    }

    constructor(
        bytes32 _merkleRoot,
        bytes32[] memory _merkleProof,
        address listingsPoolAddress,
        address marketingPoolAddress
        ) ERC20("Braq", "BRQ") {
        require(listingsPoolAddress != address(0), "Insert valid Listings Pool address");
        require(marketingPoolAddress != address(0), "Insert valid Listings Pool address");
        admins[msg.sender] = true;
        merkleRoot = _merkleRoot;
        merkleProof = _merkleProof;

        // Setting quarter timestamps
        // 16 quarters
        fundingTime[1] = 1688137200;
        fundingTime[2] = 1696086000;
        fundingTime[3] = 1704034800;
        fundingTime[4] = 1711897200;
        fundingTime[5] = 1719759600;
        fundingTime[6] = 1727708400;
        fundingTime[7] = 1735657200;
        fundingTime[8] = 1743433200;
        fundingTime[9] = 1751295600;
        fundingTime[10] = 1759244400;
        fundingTime[11] = 1767193200;
        fundingTime[12] = 1774969200;
        fundingTime[13] = 1782831600;
        fundingTime[14] = 1790780400;
        fundingTime[15] = 1798729200;
        //fundingTime[16] = 1806505200;
        fundingTime[16] = block.timestamp;

        // Setting Pools' Funding
        // Ecosystem
        for (uint8 i = 0; i < 5; i++) {
            pools[Pools.Ecosystem].amountToFund[i] = 5 * 10 ** 6;
        }
        for (uint8 i = 5; i < 9; i++) {
            pools[Pools.Ecosystem].amountToFund[i] = 25 * 10 ** 5;
        }
        for (uint8 i = 10; i < 17; i++) {
            pools[Pools.Ecosystem].amountToFund[i] = 125 * 10 ** 4;
        }
        // Rewards
        // TGE 7 500 000
        for (uint8 i = 2; i < 5; i++) {
        pools[Pools.Rewards].amountToFund[i] = 75 * 10 ** 5;
        }
        // Incentives 
        for (uint8 i = 3; i < 7; i++) {
        pools[Pools.Incentives].amountToFund[i] = 4687500;
        }
        // Listings
        // TGE 7 500 000
        _mint(listingsPoolAddress, 7500000 * 10 ** decimals());
        for (uint8 i = 1; i < 5; i++) {
        pools[Pools.Listings].amountToFund[i] = 5 * 10 ** 6;
        }
        // Private
        for (uint8 i = 5; i < 9; i++) {
        pools[Pools.Private].amountToFund[i] = 4687500;
        }
        // Team 
        for (uint8 i = 2; i < 12; i++) {
        pools[Pools.Team].amountToFund[i] = 75 * 10 ** 4;
        }
        // Marketing 
        // TGE 7 500 000
        _mint(marketingPoolAddress, 7500000 * 10 ** decimals());
        for (uint8 i = 2; i < 5; i++) {
        pools[Pools.Marketing].amountToFund[i] = 937500;
        }
        pools[Pools.Marketing].amountToFund[5] = 625000;
    }

    function mint(
    address _to,
    uint256 _amount // Amount in Braq tokens
    ) external onlyOwner { 
        require(_to != address(0), "Error: Insert a valid address"); 
        _mint(_to, _amount * 10 ** decimals());
    }

    // Function to add an admin
    function addAdmin(address _admin) external onlyAdmin {
        require(_admin != address(0), "Error: Insert a valid admin address");
        admins[_admin] = true;
    }

    // Function to remove an admin
    function removeAdmin(address _admin) external onlyAdmin {
        admins[_admin] = false;
    }

    function setPoolAddress(
        Pools _pool, 
        address _address
        ) external onlyAdmin {
        require(_address != address(0), "Error: Insert a valid address");
        pools[_pool].poolAddress = _address;
    }

    function getPoolAddress(Pools _pool) external view returns (address) {
        return pools[_pool].poolAddress;
    }

    function getAmountToFund(
        Pools pool,
        uint8 quarter
    ) external view returns (uint256) {
        return pools[pool].amountToFund[quarter];
    }

    // Quarters counted from July 2023
    function fundPool(Pools _pool, uint8 _quarter) external onlyAdmin {
        require(_quarter > 0 && _quarter < 17, "Wrong quarter value");
        if (block.timestamp < fundingTime[_quarter]) {
            revert("Error: Too early");
        }
        require(
            pools[_pool].funded[_quarter] == false,
            "Errror: Already funded"
        );
        require(
            pools[_pool].poolAddress != address(0),
            "Errror: Pool not initialised"
        );

        _mint(
            pools[_pool].poolAddress,
            pools[_pool].amountToFund[_quarter] * 10 ** decimals()
        );
        pools[_pool].funded[_quarter] = true;
    }

    function startPublicSale() external onlyOwner{
        publicSaleStarted = true;
    }

    function verify() public view returns(string memory) {
        bytes32 node = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), 'Error: Invalid proof');
        return "Proved";
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
        _mint(msg.sender, BraqAmount * 10 ** decimals());
        publicSaleSupply -= BraqAmount;
    }

    function withdraw(uint256 amount) external onlyAdmin { // Amount in wei
        require(address(this).balance > amount , "Insufficient contract balance");
        // Transfer ETH to the caller
        payable(msg.sender).transfer(amount);
    }
}
