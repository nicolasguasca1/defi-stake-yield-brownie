# Integration test for TokenFarm.sol contract integration.
from scripts.deploy import deploy_token_farm_and_dapp_token
from brownie import DappToken, TokenFarm, network, config, network
from web3 import Web3
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account, get_contract, INITIAL_PRICE_FEED_VALUE
import pytest


def test_stake_and_issue_correct_amounts(amount_staked):
    """
    Integration test for TokenFarm.sol contract integration.
    """
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for integration testing")
    # Deploy TokenFarm contract
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked,
                           dapp_token.address, {"from": account})
    starting_balance = dapp_token.balanceOf(account)
    price_feed_contract = get_contract("dai_usd_price_feed")
    (_, price, _, _, _) = price_feed_contract.latestRoundData()
    # Stake 1 token
    # 1 Token = $2000
    # We should be issued, 2000 tokens
    amount_token_to_issue = (
        price / 10 ** price_feed_contract.decimals()) * amount_staked
    # Act
    issue_tx = token_farm.issueTokens({"from": account})
    issue_tx.wait(1)
    # Assert that TokenFarm contract is deployed
    assert dapp_token.balanceOf(
        account) == starting_balance + amount_token_to_issue
