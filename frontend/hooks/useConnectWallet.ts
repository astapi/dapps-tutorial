import { ethers } from 'ethers';
import { useCallback } from 'react';

export const useConnectWallet = () => {
  const redirectUrl =  `http://localhost:3000`

  return {
    connectWallet: useCallback(async () => {
      const metamaskIsInstalled = window.ethereum?.isMetaMask;
      if (!metamaskIsInstalled) {
        window.location.href = `https://metamask.app.link/dapp/${redirectUrl}`;
        return;
      }
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        return userAddress;
      } catch (error) {
        console.log('Error connecting to metamask', error);
      }
    }, []),
  };
};