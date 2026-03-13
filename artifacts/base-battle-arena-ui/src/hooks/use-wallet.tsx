import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { switchNetwork, CHAIN_ID } from "@/lib/contracts";

interface WalletContextType {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  correctNetwork: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(true);

  const initWallet = async () => {
    if (!window.ethereum) return;
    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(web3Provider);

    const network = await web3Provider.getNetwork();
    setCorrectNetwork(Number(network.chainId) === CHAIN_ID);

    const accounts = await web3Provider.listAccounts();
    if (accounts.length > 0) {
      setAddress(accounts[0].address);
      setSigner(await web3Provider.getSigner());
    }

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        web3Provider.getSigner().then(setSigner);
      } else {
        disconnect();
      }
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    initWallet();
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet.");
      return;
    }
    setIsConnecting(true);
    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      
      if (Number(network.chainId) !== CHAIN_ID) {
        await switchNetwork();
      }
      
      await web3Provider.send("eth_requestAccounts", []);
      const newSigner = await web3Provider.getSigner();
      
      setProvider(web3Provider);
      setSigner(newSigner);
      setAddress(await newSigner.getAddress());
      setCorrectNetwork(true);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setSigner(null);
  };

  return (
    <WalletContext.Provider value={{ address, provider, signer, isConnecting, connect, disconnect, correctNetwork }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within a WalletProvider");
  return context;
}
