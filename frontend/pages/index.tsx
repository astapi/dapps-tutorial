import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useConnectWallet } from '../hooks/useConnectWallet';
import { useTutorialToken } from '../hooks/useTutorialToken';

export default function Home() {
  const { connectWallet } = useConnectWallet();
  const { mint, getBalance, ownerOf } = useTutorialToken();

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState<number>(0);

  async function clickConnectWallet() {
    const address = await connectWallet();
    console.log(address);
    await getBalance();
    setUserAddress(address);
  }

  async function clickMintButton() {
    setTokenId(await mint());
  }

  return (
    <>
      <Head>
        <title>dapps入門</title>
      </Head>
      <h1 className="text-3xl font-bold underline">
        <button onClick={clickConnectWallet} className="p-2 border border-solid">connect wallet</button>
      </h1>
      { userAddress ? <p>あなたのAddress: {userAddress}</p> : <p>metamaskに接続していません。</p> }
      { userAddress &&
        <div className="p-2 mt-4">
          <button onClick={clickMintButton} className="p-2 border border-solid">mint</button>
        </div>
      }
      {
        tokenId && <div>発行したNFTのtokenId: {tokenId}</div>
      }
    </>
  );
}