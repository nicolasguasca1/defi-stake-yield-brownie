import { Token } from "../Main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { BalanceMsg } from "../BalanceMsg";
import { useStakingBalance } from "../../hooks";
export interface PoolBalanceProps {
  token: Token;
}

export const PoolBalance = ({ token }: PoolBalanceProps) => {
  const { image, address, name } = token;
  // const { account } = useEthers();
  const balance = useStakingBalance(address);
  const formattedTokenBalance: number = balance
    ? parseFloat(formatUnits(balance, 18))
    : 0;
  console.log(balance?.toString());
  return (
    <BalanceMsg
      label={`Your staked ${name} balance`}
      tokenImgSrc={image}
      amount={formattedTokenBalance}
    />
  );
};
