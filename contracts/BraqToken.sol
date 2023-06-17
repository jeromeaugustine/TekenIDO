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
    mapping(address => bool) public funded;
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
    
    function fundEcosystem(address pool)public onlyAdmin{
        if (time< ""){
            revert("Error: Not an Admin");
        }
        _transfer(address(this), ecosystemPool, 100* 10 ** decimals());
        funded[pool]= true;
    }
    function fundStacking()public onlyAdmin{
        if (time< ""){
            revert("Error: Not an Admin");
        }
        _transfer(address(this), stakingPool, 100* 10 ** decimals());
    }


}