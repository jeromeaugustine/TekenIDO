// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Braq is ERC20, Ownable {

    address public ecosystemPool;
    address public rewardsPool;
    address public stakingPool;
    address public claimingPool;

    mapping(address => bool) public admins;
    mapping(string => bool) public funded;
    mapping(string => address) public poolAddress;
    mapping(string => uint256) public amountToFund;
    mapping(string => uint256) public fundingTime;

    // Modifier to restrict access to admins only
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function.");
        _;
    }
    
    constructor() ERC20("Braq", "BRQ") {
        _mint(address(this), 150000000 * 10 ** decimals());
        admins[msg.sender] = true;
    }

    // Function to add an admin
    function addAdmin(address _admin) external onlyAdmin {
        admins[_admin] = true;
    }

    // Function to remove an admin
    function removeAdmin(address _admin) external onlyAdmin {
        admins[_admin] = false;
    }
    
    function setPoolAddress(string memory pool, address adr) external onlyAdmin {
        if(adr==address(0)){
            revert("Errror: Insert a valid address");
        }
        poolAddress[pool]=adr;
    }

    function fundPool(string memory pool)public onlyAdmin{
        if (block.timestamp < fundingTime[pool]){
            revert("Error: Too early");
        }
        if(funded[pool]==true){
            revert("Errror: Already funded");
        }
        if(poolAddress[pool]==address(0)){
            revert("Errror: Pool not initialised");
        }

        _transfer(address(this), poolAddress[pool], amountToFund[pool] * 10 ** decimals());
        funded[pool]= true;
    }


}