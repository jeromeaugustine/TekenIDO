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

    // Modifier to restrict access to admins only
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function.");
        _;
    }

    // Function to add an admin
    function addAdmin(address _admin) external onlyAdmin {
        admins[_admin] = true;
    }

    // Function to remove an admin
    function removeAdmin(address _admin) external onlyAdmin {
        admins[_admin] = false;
    }
    
    constructor() ERC20("Braq", "BRQ") {
        _mint(address(this), 150000000 * 10 ** decimals());
    }


}