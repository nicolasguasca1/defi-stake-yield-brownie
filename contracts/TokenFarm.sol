// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract TokenFarm is Ownable {

    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] public allowedTokens;
    address[] public stakers;
    IERC20 public dappToken;
    // stakeTokens
    // unStakeTokens
    // issueTokens
    // addAllowedTokens
    // getValue
    // 100 ETH 1:1 for every 1 ETH, we give 1 DappToken
    // 50 ETH and 50 DAI staked, and we want to give a reward of 1 DAPP / 1 DAI
    
    constructor(address _dappTokenAddress) {
        dappToken = IERC20(_dappTokenAddress);
        // allowedTokens = [];
        // stakers = [];
        // uniqueTokensStaked = 0;
    }

    function setPriceFeedContract(address _token, address _priceFeed) public onlyOwner {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }
    function issueTokens() public onlyOwner {
        // issue tokens to all staking addresses
        for (uint256 stakersIndex = 0; stakersIndex < stakers.length; stakersIndex++) {
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            dappToken.transfer(recipient, userTotalValue);
            // send them a token reward
            // based on their total value locked
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user]>0, "No tokens staked!");
        for (uint256 allowedTokensIndex = 0; allowedTokensIndex < allowedTokens.length; allowedTokensIndex++) {
            // address tokenAddress = allowedTokens[tokenIndex];
            // uint256 tokenBalance = stakingBalance[_user][tokenAddress];
            totalValue = totalValue + getUserSingleTokenValue(_user, allowedTokens[allowedTokensIndex]);
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token) public view returns (uint256) {
        if (uniqueTokensStaked[_user] <= 0){
            return 0;
        }
        // price of the token * stakingBalance[_token][user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        // uint256 tokenBalance = stakingBalance[_user][_token];
        // uint256 tokenPrice = dappToken.balanceOf(_token);
        // uint256 tokenValue = tokenBalance * tokenPrice;

        // 10000000000000000000 DAI
        //  ETH/USD -> 10000000000
        // 10 * 100 = 1000
        return (stakingBalance[_token][_user] * price / (10 ** decimals));  
    }

    function getTokenValue(address _token) public view returns (uint256, uint256) {
        // priceFeedAddress
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);
        (,int256 price,,,)= priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return(uint256(price), decimals);

        // return dappToken.balanceOf(_token);
    }
    function stakeTokens(uint256 _amount, address token) public {
        // what tokens can be staked
        // how much can be staked
        require(_amount > 0, "Amount must be greater than 0");
        require(tokenIsAllowed(token), "Token is currently not allowed");
        // by calling the IERC20(address), the interface gets you the ABI from the contract address you put into the call
        IERC20(token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, token);
        stakingBalance[token][msg.sender] = stakingBalance[token][msg.sender] + _amount;
        if (uniqueTokensStaked[msg.sender] == 1){
            stakers.push(msg.sender);
        } 
        
    }
// to do
    // function removeStakers(address )


    function unstakeTokens(address token) public {
        uint256 balance = stakingBalance[token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        IERC20(token).transfer(msg.sender, balance);
        stakingBalance[token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;

    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user]<= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
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