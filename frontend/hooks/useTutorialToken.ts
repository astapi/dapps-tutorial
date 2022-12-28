import { ethers } from "ethers";
import TutorialTokenArtifact from "../contracts/TutorialToken.json";
import contractAddress from "../contracts/contract-address.json";
import { db } from '../lib/firebase';
import { doc, getDocs, query, collection } from "firebase/firestore";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

type useTutorialTokenReturnType = () => {
  preMint: (address: string, callBack: () => {}) => Promise<void>;
  publicMint: (callBack: () => {}) => Promise<void>;
  totalSuply: () => Promise<number>;
  tokenOfOwnerByIndex: () => Promise<number>;
  getTokenIdList: () => Promise<number[]>;
  setPreSale: (preSale: boolean) => Promise<void>;
  setPublicSale: (publicSale: boolean) => Promise<void>;
}

export const useTutorialToken: useTutorialTokenReturnType = () => {
  let provider: ethers.providers.Web3Provider|null = null;
  let token: ethers.Contract|null = null;

  async function _initializeEthers() {
    provider = new ethers.providers.Web3Provider(window.ethereum);

    token = await new ethers.Contract(
      contractAddress.TutorialToken,
      TutorialTokenArtifact.abi,
      provider.getSigner(),
    );
    console.log(token);
  }

  async function preMint(address: string, callBack: () => {}): Promise<void> {
    if (token === null && provider === null) await _initializeEthers();
    const q = query(collection(db, "allowList"));
    const querySnapshot = await getDocs(q);
    const treeValues = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.address && treeValues.push([data.address]);
    });
    const tree = StandardMerkleTree.of(treeValues, ["address"]);
    let proof: string[]|undefined;
    for (const [i, v] of tree.entries()) {
      if (v[0] === address) {
        proof = tree.getProof(i);
      }
    }
    console.log(proof);
    const transaction = await token.preMint(proof);
    const res = await transaction.wait();
    console.log(res);
    callBack();
  }

  async function publicMint(callBack: () => {}): Promise<void> {
    if (token === null && provider === null) await _initializeEthers();
    const transaction = await token.mint();
    const res = await transaction.wait();
    console.log(res);
    callBack();
  }

  async function totalSuply(): Promise<number> {
    if (token === null && provider === null) await _initializeEthers();
    const totalSuply = await token.totalSupply();
    console.log(totalSuply);
    return totalSuply.toNumber();
  }

  async function tokenOfOwnerByIndex(): Promise<number> {
    if (token === null && provider === null) await _initializeEthers();
    const address = await provider.getSigner().getAddress();
    const count = await token.tokenOfOwnerByIndex(address, 1);
    console.log('tokenOfOwnerByIndex', count.toNumber());
    return count.toNumber();
  }

  async function getTokenIdList(): Promise<number[]> {
    if (token === null && provider === null) await _initializeEthers();
    const address = await provider.getSigner().getAddress();
    const count = await token.balanceOf(address);
    const tokenIdList = [];
    for (let i = 0; i < count.toNumber(); i++) {
      const tokenId = await token.tokenOfOwnerByIndex(address, i);
      tokenIdList.push(tokenId.toNumber());
    }
    return tokenIdList;
  }

  async function setPreSale(preSale: boolean): Promise<void> {
    if (token === null && provider === null) await _initializeEthers();
    await token.setPreSale(preSale);
  }

  async function setPublicSale(publicSale: boolean): Promise<void> {
    if (token === null && provider === null) await _initializeEthers();
    await token.setPublicSale(publicSale);
  }

  return {
    preMint,
    publicMint,
    totalSuply,
    tokenOfOwnerByIndex,
    getTokenIdList,
    setPreSale,
    setPublicSale,
  }
};