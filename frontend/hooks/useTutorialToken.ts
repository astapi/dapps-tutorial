import { ethers } from "ethers";
import TutorialTokenArtifact from "../contracts/TutorialToken.json";
import contractAddress from "../contracts/contract-address.json";
import { useState } from "react";

type useTutorialTokenReturnType = () => {
  mint: () => Promise<string>;
  getBalance: () => Promise<number>;
  ownerOf: () => Promise<number>;
}

export const useTutorialToken: useTutorialTokenReturnType = () => {
  // const [provider, setProvider] = useState<ethers.providers.Web3Provider|null>(null);
  // const [token, setToken] = useState<ethers.Contract|null>(null);
  let provider: ethers.providers.Web3Provider|null = null;
  let token: ethers.Contract|null = null;

  async function _initializeEthers() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(_provider);
    // setProvider(_provider);
    console.log(provider);

    token = await new ethers.Contract(
      contractAddress.TutorialToken,
      TutorialTokenArtifact.abi,
      provider.getSigner(),
    );
    console.log(token);
  }

  return {
    mint: async () => {
      await _initializeEthers();
      const res = await token.mint();
      console.log(res);
      const receipt = await res?.wait();
      console.log(receipt);
      // return tokenId;
      return 'hogehoge';
    },

    ownerOf: async () => {
      if (token === null && provider === null) await _initializeEthers();
      const address = await token.ownerOf(1);
      console.log(address);
    },

    getBalance: async () => {
      if (token === null && provider === null) await _initializeEthers();
      const address = await provider.getSigner().getAddress();
      console.log(address);
      const balance = await token.hoge();
      console.log(balance);
      return 1;
    },
  }
};