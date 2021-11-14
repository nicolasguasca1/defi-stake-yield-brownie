import { Token } from "../Main";
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { useStakeTokens } from "../../hooks";
import { utils } from "ethers";

export interface UnstakeFormProps {
  token: Token;
}

export const UnstakeForm = ({ token }: UnstakeFormProps) => {
  const { address: tokenAddress, name } = token;
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(tokenAddress, account);
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  const { notifications } = useNotifications();
  // const [amount, setAmount] = useState<
  //   number | string | Array<number> | string
  // >(0);
  const { Unstake, state: unstakeState } = useStakeTokens(tokenAddress);

  const handleUnstakeSubmit = () => {
    // const amountAsWei = utils.parseEther(amount.toString());
    return Unstake();
  };

  const isMining = unstakeState.status === "Mining";
  const [showUnstakeSuccess, setShowUnstakeSuccess] = useState(false);
  // const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false);

  const handleCloseSnack = () => {
    setShowUnstakeSuccess(false);
    // setShowStakeTokenSuccess(false);
  };
  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Unstake Tokens"
      ).length > 0
    ) {
      setShowUnstakeSuccess(true);
      // setShowStakeTokenSuccess(false);
    }
    // if (
    //   notifications.filter(
    //     (notification) =>
    //       notification.type === "transactionSucceed" &&
    //       notification.transactionName === "Stake Tokens"
    //   ).length > 0
    // ) {
    //   setShowERC20ApprovalSuccess(false);
    //   setShowStakeTokenSuccess(true);
    // }
  }, [notifications, showUnstakeSuccess]);
  return (
    <>
      <Button
        color="primary"
        size="large"
        onClick={handleUnstakeSubmit}
        disabled={isMining}
      >
        {isMining ? <CircularProgress size={26} /> : `Unstake all ${name}`}
      </Button>
      {/* <Snackbar
        open={showERC20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          ERC-20 token transferapproved! Now approve the 2nd transaction
          please...
        </Alert>
      </Snackbar> */}
      <Snackbar
        open={showUnstakeSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Tokens Unstaked!
        </Alert>
      </Snackbar>
    </>
  );
};
