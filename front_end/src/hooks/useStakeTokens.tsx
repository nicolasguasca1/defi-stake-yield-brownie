import { useEthers, useContractFunction } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import ERC20 from "../chain-info/contracts/MockERC20.json";
import { Contract } from "@ethersproject/contracts";
import networkMapping from "../chain-info/deployments/map.json";
import { constants, utils } from "ethers";
import { useState, useEffect } from "react";

export const useStakeTokens = (tokenAddress: string) => {
  // address
  // abi
  // chainId
  const { chainId } = useEthers();
  const { abi } = TokenFarm;
  const tokenFarmAddress = chainId
    ? networkMapping[String(chainId)]["TokenFarm"][0]
    : constants.AddressZero;
  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface);

  const erc20ABI = ERC20.abi;
  const erc20Interface = new utils.Interface(erc20ABI);
  const erc20Contract = new Contract(tokenAddress, erc20Interface);
  // approve
  // stake tones
  const { send: approveERC20Send, state: approveAndStakeERC20State } =
    useContractFunction(erc20Contract, "approve", {
      transactionName: "Approve ERC20 transfer"
    });

  const approveAndStake = (amount: string) => {
    setAmountToStake(amount);
    return approveERC20Send(tokenFarmAddress, amount);
  };

  const { send: stakeSend, state: stakeState } = useContractFunction(
    tokenFarmContract,
    "stakeTokens",
    { transactionName: "Stake Tokens" }
  );

  const [amountToStake, setAmountToStake] = useState("0");
  useEffect(() => {
    if (approveAndStakeERC20State.status === "Success") {
      stakeSend(amountToStake, tokenAddress);
    }
  }, [approveAndStakeERC20State, amountToStake, tokenAddress]);

  const [state, setState] = useState(approveAndStakeERC20State);

  useEffect(() => {
    if (approveAndStakeERC20State.status === "Success") {
      setState(stakeState);
    } else {
      setState(approveAndStakeERC20State);
    }
  }, [approveAndStakeERC20State, stakeState]);

  // unstake tokens
  const { send: unstakeSend, state: unstakeState } = useContractFunction(
    tokenFarmContract,
    "unstakeTokens",
    {
      transactionName: "Unstake Tokens"
    }
  );

  const Unstake = () => {
    return unstakeSend(tokenAddress);
  };

  // const [amountToUnstake, setAmountToUnstake] = useState("0");
  useEffect(() => {
    if (unstakeState.status === "Success") {
      setState(unstakeState);
    }
    // setAmountToUnstake(amountToUnstake)
    // Unstake();
    // setState(unstakeState);
  }, [unstakeState]);

  return { approveAndStake, state, Unstake };
};
