/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import dapp from "../dapp.png";
import eth from "../eth.png";
import fau from "../dai.png";

import { YourWallet } from "./yourWallet";

export type Token = {
  image: string;
  address: string;
  name: string;
};

const Main = () => {
  // Show token values
  // Get the address of different tokens
  // Get the balance of the users wallet
  // Send our brownie config to the front-end
  const { chainId } = useEthers();
  const networkName = chainId ? helperConfig[chainId] : "dev";
  let stringChainId = String(chainId);
  const dappTokenAddress = chainId
    ? networkMapping[String(chainId)]["DappToken"][0]
    : constants.AddressZero;
  const wethTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["weth_token"]
    : constants.AddressZero;
  const fauTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["fau_token"]
    : constants.AddressZero;
  const supportedTokens: Array<Token> = [
    {
      image: dapp,
      address: dappTokenAddress,
      name: "DAPP"
    },
    {
      image: eth,
      address: wethTokenAddress,
      name: "WETH"
    },
    {
      image: fau,
      address: fauTokenAddress,
      name: "DAI"
    }
  ];
  return <YourWallet supportedTokens={supportedTokens} />;
};

export default Main;
