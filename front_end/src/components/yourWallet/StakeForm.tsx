import { Token } from "../Main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { Button, Input } from "@material-ui/core";
import React, { useState } from "react";
import { useStakeTokens } from "../../hooks";
import { utils } from "ethers";

export interface StakeFormProps {
  token: Token;
}

export const StakeForm = ({ token }: StakeFormProps) => {
  const { address: tokenAddress, name } = token;
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(tokenAddress, account);
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  const [amount, setAmount] = useState<
    number | string | Array<number> | string
  >(0);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value);
    setAmount(newAmount);
    console.log(newAmount);
  };
  const { approve, approveERC20State } = useStakeTokens(tokenAddress);

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString());
    return approve(amountAsWei as unknown as string);
  };
  return (
    <>
      <Input onChange={handleInputChange} />
      <Button color="primary" size="large" onClick={handleStakeSubmit}>
        Stake
      </Button>
    </>
  );
};
