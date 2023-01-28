import React, { useState, useEffect } from 'react';
import './App.css';

import { Button, TextField } from "@mui/material";
import { CIDString, Web3File, Web3Storage } from "web3.storage"

import Marketplace from "./abi/Marketplace.json";
import { ethers } from 'ethers';
const CONTRACT_ADDRESS = "0x6295CCd1f65979bC62Cd7bC7130a503e4962bd28";
const API_KEY = "eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ"


function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allNFTs, setAllNFTs] = useState("");
  const [IPFSResult, setIPFSResult] = useState("");
  const [NFTName, setNFTName] = useState("");
  const [NFTDescription, setNFTDescription] = useState("");

  const connectWallet = async () => {
    const Window = window as any
    if (!Window.ethereum) console.log("ethereum object not foud");
    const accounts: string = await Window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length === 0) console.log("account not found");
    setCurrentAccount(accounts[0]);
  }

  const checkWalletConnection = async () => {
    const Window = window as any;
    if (!Window.ethereum) console.log("ethereum object not found");
    const accounts: string = await Window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) console.log("accounts not found");
    setCurrentAccount(accounts[0]);
  }

  useEffect(() => {
    checkWalletConnection();
  }, [])

  const mintNFT = async () => {
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Marketplace.abi,
        signer
      )
      const txn = await marketplaceContract.mintNFT(IPFSResult, NFTName, NFTDescription);
      await txn.wait();
      console.log("tx:", txn.hash);
    } catch (error) {
      console.log(error);
    }
  }

  const getNFTInfo = async () => {
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Marketplace.abi,
        signer
      )
      setAllNFTs(await marketplaceContract.getAllNFTs());
      console.log(allNFTs[0][0]);
    } catch (error) {
      console.log(error)
    }
  }

  const putImage =async (client: Web3Storage, image: any) => {
    const rootCid = await client.put(image.files, {
      name: 'metadata',
      maxRetries: 3
    })
    return rootCid;
  }

  const retriveFiles =async (client:Web3Storage, cid: CIDString) => {
      const response = await client.get(cid);
      if(!response) throw new Error("cannot retrive files");
      const files = await response.files();
      return files;
  }

  const uploadAndRetrive = async  (e: any) => {
    const client = new Web3Storage({ token: API_KEY});
    const image = e.target

    const rootCid: CIDString = await putImage(client, image);
    const files: Web3File[] = await retriveFiles(client, rootCid);

    for (let file of files) {
      setIPFSResult(file.cid);
    }
  }

  return (
    <div className="App">
      <div>
        <Button variant='contained' color='primary'sx={{ p: -2 }} onClick={connectWallet}>
          connect wallet
        </Button>
      </div>
      <p></p>
      <div>
        <input className='imageToIpfs' name="upload" type="file" accept='.jpg, .png' onChange={uploadAndRetrive} />
        {IPFSResult}
      </div>
      <p></p>
      <div>
        <TextField 
          variant='outlined'
          name="ipfsLink"
          placeholder='IPFSのリンクを入力'
          type="text"
          id="ipfs"
          onChange={(e) => setIPFSResult(e.target.value)}
          multiline
          rows={1}
        />
        <TextField 
          variant='outlined'
          name="name"
          placeholder='NFTの名前を入力'
          type="text"
          id="name"
          onChange={(e) => setNFTName(e.target.value)}
          multiline
          rows={1}
        />
        <TextField 
          variant='outlined'
          name="description"
          placeholder='description'
          type="text"
          id="description"
          onChange={(e) => setNFTDescription(e.target.value)}
          multiline
          rows={1}
        />
        <></>
        <Button variant='contained' color='primary'sx={{ p: -2 }} onClick={mintNFT}>
          mint nft
        </Button>
      </div>
      <p></p>
      <div>
        <Button variant='contained' color='primary'sx={{ p: -2 }} onClick={getNFTInfo}>
          get nft info
        </Button>
      </div>
      <p></p>
      <div>
        <img src="https://bafybeicgiaincg4bto72niuqgseflfy76gk7so6li5jm3r24mgr76jdbbe.ipfs.dweb.link/downloadable-bad75a2e-bbbc-4c02-8954-22f4234412ec.png" />
      </div>
    </div>
  );
}

export default App;
