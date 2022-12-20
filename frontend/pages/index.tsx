import Head from 'next/head';
import { useConnectWallet } from '../hooks/useConnectWallet';

export default function Home() {
  const { connectWallet } = useConnectWallet();
  return (
    <>
      <Head>
        <title>dapps入門</title>
      </Head>
      <h1 className="text-3xl font-bold underline">
        <button onClick={connectWallet} className="p-2 border border-solid">connect wallet</button>
      </h1>
    </>
  );
}