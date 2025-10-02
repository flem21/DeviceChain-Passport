'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

interface Web3ContextType {
  web3: Web3 | null;
  account: string | null;
  connectWallet: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const handleAccountsChanged = (accounts: string[]) => {
         if (accounts.length > 0) {
            setAccount(accounts[0]);
         } else {
            setAccount(null);
         }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Try to get accounts on initial load
      web3Instance.eth.getAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      return () => {
        if (window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };

    } else {
      console.warn("No Ethereum provider found. Install MetaMask.");
    }
  }, []);

  const connectWallet = async () => {
    if (web3 && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (Array.isArray(accounts) && accounts.length > 0) {
            setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("User denied account access");
        throw error;
      }
    } else {
      console.error("Web3 is not initialized or ethereum provider not found");
      throw new Error("Web3 is not initialized or ethereum provider not found");
    }
  };

  return (
    <Web3Context.Provider value={{ web3, account, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
