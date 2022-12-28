import Head from 'next/head';
import Layout from '../components/layout';
import Content from '../components/content';
import { useState } from 'react';
import { useConnectWallet } from '../hooks/useConnectWallet';
import { useTutorialToken } from '../hooks/useTutorialToken';
import { useRequestAllowListFormModal } from '../hooks/useRequestAllowListFormModal'

export default function Home() {
  const { connectWallet } = useConnectWallet();
  const { preMint, publicMint, totalSuply, getTokenIdList } = useTutorialToken();

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [_totalSuply, setTotalSuply] = useState<number|null>(null);
  const [tokenIdList, setTokenIdList] = useState<number[]>([]);
  const { RequestAllowListFormModal, openRequestAllowListFormModal, closeRequestAllowListFormModal  } = useRequestAllowListFormModal();

  async function clickConnectWallet() {
    const address = await connectWallet();
    setUserAddress(address);

    setTotalSuply(await totalSuply());
    setTokenIdList(await getTokenIdList());
  }

  async function clickPreMintButton() {
    await preMint(userAddress, callBackMint);
  }

  async function clickPublicMintButton() {
    await publicMint(callBackMint);
  }

  async function callBackMint() {
    setTotalSuply(await totalSuply());
    setTokenIdList(await getTokenIdList());
  }

  function renderTokenIdList() {
    return tokenIdList.map((tokenId) => {
      return <li key={tokenId}>{tokenId}</li>
    })
  }

  return (
    <>
      <Head>
        <title>dapps入門</title>
      </Head>
      <Layout>
        <RequestAllowListFormModal />
        <h1 className="text-3xl font-bold underline">dapps Tutorial</h1>
        <Content>
          <div>
            <p className="text-2xl font-bold">AllowList申し込みはこちら</p>
            <button onClick={openRequestAllowListFormModal} className="p-2 mt-4 mb-4 text-white bg-blue-400 border border-solid rounded">AL申し込み</button>
          </div>
          { userAddress ?
            <p className="mt-2">あなたのAddress: {userAddress}</p>
            :
            <div>
              <button onClick={clickConnectWallet} className="p-2 text-white bg-blue-400 border border-solid rounded">connect wallet</button>
            </div>
          }
          

          <hr className="mt-4 mb-4" />

          { userAddress &&
            <>
              <p className="text-2xl font-bold">Mintはこちら</p>
              <div className="flex mt-4">
                <div className="">
                  <button onClick={clickPreMintButton} className="p-2 text-white bg-red-400 border border-solid rounded">preMint</button>
                </div>
                <div className="ml-4">
                  <button onClick={clickPublicMintButton} className="p-2 text-white bg-red-400 border border-solid rounded">publicMint</button>
                </div>
              </div>
              <hr className="mt-4 mb-4" />
            </>
          }
          
          { userAddress &&
            <>
              <div>
                <p className="text-2xl font-bold">発行済みトークン数: { _totalSuply !== null ? _totalSuply : 'metamastk未接続' }</p>
              </div>
              
            </>
          }
          {
            tokenIdList.length > 0 &&
            <>
              <hr className="mt-4 mb-4" />
              <div>
              <p>あなたのTokenIdのリストはこちらです</p>
              <ul className="max-w-md mt-2 ml-2 space-y-1 list-disc list-inside">
               {renderTokenIdList()}
              </ul>
              </div>
            </>
          }
        </Content>
      </Layout>
    </>
  );
}