import { Token } from "../Main";
import { useState, useEffect } from "react";
import { Box, Tab, makeStyles } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { PoolBalance } from "./PoolBalance";
import { UnstakeForm } from "./UnstakeForm";

interface PoolProps {
  supportedTokens: Array<Token>;
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4)
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px"
  },
  header: {
    color: "white"
  }
}));

export const TokenFarmPool = ({ supportedTokens }: PoolProps) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTokenIndex(Number(newValue));
  };
  return (
    <div className="margin py-10">
      <Box className="py-10">
        <h1 className={classes.header}>The TokenFarm Contract</h1>
        <Box className={classes.box}>
          <TabContext value={selectedTokenIndex.toString()}>
            <TabList aria-label="stake form tabs" onChange={handleChange}>
              {supportedTokens.map((token, index) => (
                <Tab key={index} label={token.name} value={index.toString()} />
              ))}
            </TabList>
            {supportedTokens.map((token, index) => {
              return (
                <TabPanel key={index} value={index.toString()}>
                  <div className={classes.tabContent}>
                    <PoolBalance token={supportedTokens[selectedTokenIndex]} />
                    <UnstakeForm token={supportedTokens[selectedTokenIndex]} />
                  </div>
                </TabPanel>
              );
            })}
          </TabContext>
        </Box>
      </Box>
    </div>
  );
};
