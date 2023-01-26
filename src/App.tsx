import React, { useState, useEffect } from 'react';
import './App.css';

import { Button } from "@mui/material";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async() => {
    const Window = window as any
    if(!Window.ethereum) console.log("ethereum object not foud");
    const accounts: string = await Window.ethereum.request({ method: "eth_requestAccounts"});
    if (accounts.length === 0) console.log("account not found");
    setCurrentAccount(accounts[0]);
  }

  const checkWalletConnection =async () => {
    const Window = window as any;
    if(!Window.ethereum) console.log("ethereum object not found");
    const accounts: string = await Window.ethereum.request({ method: "eth_accounts"});
    if (accounts.length === 0) console.log("accounts not found");
    setCurrentAccount(accounts[0]);
  }

  useEffect(()=> {
    checkWalletConnection();
  }, [])

  return (
    <div className="App">
      <Button variant='contained' color='primary' onClick={connectWallet}>
        connect wallet
      </Button>
    </div>
  );
}

export default App;
