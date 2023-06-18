// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BraqToken is ERC20, Ownable {

    uint256 public publicSaleSupply = 10;
    
    mapping(address => bool) public admins;

    enum Pools {Rewards, Incentives, Listings, Team, Marketing, Private, Ecosystem}
    
    mapping(Pools => mapping(uint8 => bool)) public funded;
    mapping(Pools => address) public poolAddress;
    mapping(Pools => mapping(uint8 => uint256)) public amountToFund; // In BraqTokens, multiply by decimals()
    mapping(Pools => mapping(uint8 => uint256)) public fundingTime;

    // Modifier to restrict access to admins only
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function.");
        _;
    }

    constructor() ERC20 ("Braq", "BRQ") {
        // minting only public sale tokens
        _mint(address(this), publicSaleSupply * 10 ** decimals());
        admins[msg.sender] = true;
        // Setting Pools
        // Ecosystem
        for (uint8 i = 0; i < 5; i++) {
            amountToFund[Pools.Ecosystem][i]=5 * 10 ** 6;
        }
        for (uint8 i = 5; i < 9; i++) {
            amountToFund[Pools.Ecosystem][i]= 2.5 * 10 ** 6;
        }
        for (uint8 i = 10; i < 17; i++) {
            amountToFund[Pools.Ecosystem][i]= 1.25 * 10 ** 6;
        }
        // Rewards
        
    }

    // Function to add an admin
    function addAdmin(address _admin) external onlyAdmin {
        admins[_admin] = true;
    }

    // Function to remove an admin
    function removeAdmin(address _admin) external onlyAdmin {
        admins[_admin] = false;
    }
    
    function setPoolAddress(Pools pool, address adr) external onlyAdmin {
        require(adr != address(0), "Error: Insert a valid address");
        poolAddress[pool]=adr;
    }

    // Quarters counted from July 2023
    function fundPool(Pools pool, uint8 quarter) external onlyAdmin {
        if (block.timestamp < fundingTime[pool][quarter]){
            revert("Error: Too early");
        }
        require(funded[pool][quarter] == false, "Errror: Already funded");
        require(poolAddress[pool] != address(0), "Errror: Pool not initialised");

        _mint(poolAddress[pool], amountToFund[pool][quarter] * 10 ** decimals());
        funded[pool][quarter]= true;
    }

    function publicSale() public payable {
        uint256 EthAmount = msg.value / 10 ** 18;
        uint256 BraqAmount = EthAmount * 200;
        if(EthAmount< 100 ){
            revert("Error: Too small amount for purchase");
        }
        if(BraqAmount > publicSaleSupply){
            revert("Error: Too big amount for purchase");
        }
        _transfer(address(this), msg.sender, BraqAmount * 10 ** decimals());
        publicSaleSupply -= BraqAmount;
    }


}