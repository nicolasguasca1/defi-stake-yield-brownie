from brownie import network, MockDAI
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account, get_contract, INITIAL_PRICE_FEED_VALUE
import pytest
from scripts.deploy import deploy_token_farm_and_dapp_token
from web3 import Web3


def test_set_price_feed_contract():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        dapp_token.address, price_feed_address, {"from": account})
    # Assert
    assert token_farm.tokenPriceFeedMapping(
        dapp_token.address) == price_feed_address
    with pytest.raises(Exception):
        token_farm.setPriceFeedContract(
            dapp_token.address, non_owner, {"from": non_owner})


def test_stake_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # Act
    # fau_token.balanceOf(account) == Web3.toWei(100, "ether")
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    # fau_token = get_contract("fau_token")
    # tx = fau_token.transfer(account, amount_staked)
    # tx.wait(1)
    token_farm.stakeTokens(amount_staked,
                           dapp_token.address, {"from": account})
    # Assert
    assert (
        token_farm.stakingBalance(
            dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, dapp_token


def test_issue_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    # stakers = token_farm.stakers
    # stakersIndex = 0
    # for staker in range(stakers):
    #     recipient = staker
    #     userTotalValue = getUserTotalValue(recipient)
    #     dappToken.transfer(recipient, userTotalValue)
    # send them a token reward
    # based on their total value locked
    # Act
    starting_balance = dapp_token.balanceOf(account.address)
    token_farm.issueTokens()
    # Assert
    # we are staking 1 dapp_token == in price to 1 ETH
    # so...we should get 2,000 DAPP tokens in reward
    # since the price of eth is $2,000
    assert dapp_token.balanceOf(
        account) == starting_balance + INITIAL_PRICE_FEED_VALUE
