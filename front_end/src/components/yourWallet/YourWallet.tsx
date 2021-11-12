import { Token } from "../Main";
import { useState, useEffect } from "react";
import { Box, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { WalletBalance } from "./WalletBalance";
import { StakeForm } from "./StakeForm";

interface YourWalletProps {
  supportedTokens: Array<Token>;
}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTokenIndex(Number(newValue));
  };
  return (
    <Box>
      <h1 className="your-wallet">Your wallet</h1>
      <Box>
        <TabContext value={selectedTokenIndex.toString()}>
          <TabList aria-label="stake form tabs" onChange={handleChange}>
            {supportedTokens.map((token, index) => (
              <Tab key={index} label={token.name} value={index.toString()} />
            ))}
          </TabList>
          {supportedTokens.map((token, index) => {
            return (
              <TabPanel key={index} value={index.toString()}>
                <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                <StakeForm token={supportedTokens[selectedTokenIndex]} />
              </TabPanel>
            );
          })}
        </TabContext>
      </Box>
    </Box>
  );
};
