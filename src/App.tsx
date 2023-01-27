import React, { useState, useEffect } from 'react';
import './App.css';

import { Button } from "@mui/material";

import Marketplace from "./abi/Marketplace.json";
import { ethers } from 'ethers';
const CONTRACT_ADDRESS = "0x6295CCd1f65979bC62Cd7bC7130a503e4962bd28";

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

  const getNFTInfo =async () => {
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Marketplace.abi,
        signer
      )
      let allNFTs: Array<Array<any>>;
      allNFTs = await marketplaceContract.getAllNFTs();
      console.log(allNFTs[0][0]);
    } catch (error){
      console.log(error)
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
      <Button variant='contained' color='primary' onClick={getNFTInfo}>
        get nft info
      </Button>
    </div>
  );
}

export default App;
