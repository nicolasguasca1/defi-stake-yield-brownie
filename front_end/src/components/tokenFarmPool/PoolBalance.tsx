import { Token } from "../Main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { BalanceMsg } from "../BalanceMsg";
export interface PoolBalanceProps {
  token: Token;
}

export const PoolBalance = ({ token }: PoolBalanceProps) => {
  const { image, address, name } = token;
  // const { account } = useEthers();
  const tokenBalance = useTokenBalance(address, address);
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  console.log(tokenBalance?.toString());
  return (
    <BalanceMsg
      label={`Your staked ${name} balance`}
      tokenImgSrc={image}
      amount={formattedTokenBalance}
    />
  );
};
