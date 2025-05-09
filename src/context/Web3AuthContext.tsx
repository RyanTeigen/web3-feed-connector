
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface IWeb3AuthContext {
  isConnecting: boolean;
  connectWallet: (provider: 'metamask' | 'walletconnect' | 'coinbase') => Promise<void>;
  disconnectWallet: () => void;
  walletAddress: string | null;
  walletType: 'metamask' | 'walletconnect' | 'coinbase' | null;
  chainId: number | null;
}

const Web3AuthContext = createContext<IWeb3AuthContext | undefined>(undefined);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'metamask' | 'walletconnect' | 'coinbase' | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Load saved wallet connection
  useEffect(() => {
    if (user) {
      const loadWalletConnection = async () => {
        try {
          const { data } = await supabase
            .from('wallet_connections')
            .select('*')
            .eq('user_id', user.id)
            .order('last_connected_at', { ascending: false })
            .limit(1)
            .single();
            
          if (data) {
            setWalletAddress(data.wallet_address);
            setWalletType(data.wallet_type);
            setChainId(data.chain_id);
          }
        } catch (error) {
          console.error('Error loading wallet connection:', error);
        }
      };
      
      loadWalletConnection();
    } else {
      // Reset wallet state when user logs out
      setWalletAddress(null);
      setWalletType(null);
      setChainId(null);
    }
  }, [user]);

  const connectWallet = async (provider: 'metamask' | 'walletconnect' | 'coinbase') => {
    setIsConnecting(true);
    
    try {
      let ethereum: any;
      
      // Get the provider based on the wallet type
      if (provider === 'metamask') {
        // Safely access window.ethereum with proper type checking
        if (typeof window !== 'undefined' && window.ethereum) {
          ethereum = window.ethereum;
        } else {
          throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
        }
      } else if (provider === 'walletconnect' || provider === 'coinbase') {
        toast({
          title: "Coming Soon",
          description: `${provider === 'walletconnect' ? 'WalletConnect' : 'Coinbase Wallet'} integration will be available soon.`,
          variant: "default",
        });
        setIsConnecting(false);
        return;
      }
      
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainIdHex, 16);
      
      // Get nonce from the server
      const { data: nonceData } = await supabase.functions.invoke('web3-auth', {
        body: {
          action: 'getNonce',
          address,
          chain_id: chainIdDecimal,
          wallet_type: provider
        },
      });
      
      const { nonce, message } = nonceData;
      
      // Request signature
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });
      
      // Verify signature
      const { data: authData, error } = await supabase.functions.invoke('web3-auth', {
        body: {
          action: 'verifySignature',
          address,
          signature,
          nonce,
          message,
          chain_id: chainIdDecimal,
          wallet_type: provider
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Set session with the returned tokens
      const { access_token, refresh_token } = authData;
      await supabase.auth.setSession({
        access_token,
        refresh_token
      });
      
      // Update local state
      setWalletAddress(address);
      setWalletType(provider);
      setChainId(chainIdDecimal);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected with ${provider}`,
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectWallet = async () => {
    try {
      if (user && walletAddress) {
        // Optional: Update the database to mark the wallet as disconnected
        // For now we just clear the local state
      }
      
      setWalletAddress(null);
      setWalletType(null);
      setChainId(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet.",
        variant: "destructive",
      });
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        isConnecting,
        connectWallet,
        disconnectWallet,
        walletAddress,
        walletType,
        chainId,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
}
