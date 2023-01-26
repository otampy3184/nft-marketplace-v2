import React, { useState, useEffect } from 'react';
import './App.css';

import { Button } from "@mui/material";

import Marketplace from "./abi/Marketplace.json";
import { ethers } from 'ethers';
const CONTRACT_ADDRESS = "0xc74c1d2023B9F9Bfc5515B101BcB9b134300839f";

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

  const mintNFT = async() => {
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Marketplace.abi,
        signer
      )
      const txn = await marketplaceContract.mintNFT("test", "test", "test");
      await txn.wait();
      console.log("tx:", txn.hash);
    } catch (error){
      console.log(error);
    }
  }

  return (
    <div className="App">
      <Button variant='contained' color='primary' onClick={connectWallet}>
        connect wallet
      </Button>
      <Button variant='contained' color='primary' onClick={mintNFT}>
        mint nft
      </Button>
    </div>
  );
}

export default App;
