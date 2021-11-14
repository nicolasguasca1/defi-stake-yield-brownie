import { Token } from "../Main";
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
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
  const { notifications } = useNotifications();
  const [amount, setAmount] = useState<
    number | string | Array<number> | string
  >(0);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value);
    setAmount(newAmount);
    console.log(newAmount);
  };
  const { approveAndStake, state: approveAndStakeERC20State } =
    useStakeTokens(tokenAddress);

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString());
    return approveAndStake(amountAsWei as unknown as string);
  };

  const isMining = approveAndStakeERC20State.status === "Mining";
  const [showERC20ApprovalSuccess, setShowERC20ApprovalSuccess] =
    useState(false);
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false);

  const handleCloseSnack = () => {
    setShowERC20ApprovalSuccess(false);
    setShowStakeTokenSuccess(false);
  };
  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Approve ERC20 transfer"
      ).length > 0
    ) {
      setShowERC20ApprovalSuccess(true);
      setShowStakeTokenSuccess(false);
    }
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Stake Tokens"
      ).length > 0
    ) {
      setShowERC20ApprovalSuccess(false);
      setShowStakeTokenSuccess(true);
    }
  }, [notifications, showStakeTokenSuccess, showERC20ApprovalSuccess]);
  return (
    <>
      <Input onChange={handleInputChange} />
      <Button
        color="primary"
        size="large"
        onClick={handleStakeSubmit}
        disabled={isMining}
      >
        {isMining ? <CircularProgress size={26} /> : "Stake"}
      </Button>
      <Snackbar
        open={showERC20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          ERC-20 token transfer approved! Now approve the 2nd transaction
          please...
        </Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Tokens Staked!
        </Alert>
      </Snackbar>
    </>
  );
};
