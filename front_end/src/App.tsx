import React from "react";
import { DAppProvider, ChainId } from "@usedapp/core";
import Header from "./components/Header";
import { Container, Typography } from "@material-ui/core";
import Main from "./components/Main";

function App() {
  return (
    <DAppProvider
      config={{
        supportedChains: [ChainId.Kovan],
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000
        }
      }}
    >
      <Header />
      <Container maxWidth="md">
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h6"
          align="center"
        >
          <Main />
        </Typography>
      </Container>
    </DAppProvider>
  );
}

export default App;
