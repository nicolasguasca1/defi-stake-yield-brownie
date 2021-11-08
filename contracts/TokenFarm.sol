// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFarm is Ownable {
    // stakeTokens
    // unStakeTokens
    // issueTokens
    // addAllowedTokens
    // getEthValue
    address[] public allowedTokens;
    function stakeTokens(uint256 _amount, address _token) public {
        // what tokens can be staked
        // how much can be staked
        require(_amount > 0, "Amount must be greater than 0");
        // require(_token is allowed)
    }

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public view returns (bool) {
        // what tokens can be staked
        for( uint256 allowedTokenIndex=0; allowedTokenIndex<allowedTokens.length; allowedTokenIndex++ ) {
            if (allowedTokens[allowedTokenIndex] == _token) {
                return true;
            }
        } 
        return false;
    }
    }