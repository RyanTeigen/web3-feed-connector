
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | null;

export interface UseWalletConnectionReturn {
  isConnecting: boolean;
  connectWallet: (provider: WalletType) => Promise<{
    success: boolean;
    address?: string;
    chainId?: number;
    walletType?: WalletType;
    error?: string;
  }>;
  disconnectWallet: () => Promise<void>;
}

export function useWalletConnection(): UseWalletConnectionReturn {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async (provider: WalletType) => {
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
        return { success: false };
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
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected with ${provider}`,
        variant: "default",
      });
      
      return {
        success: true,
        address,
        chainId: chainIdDecimal,
        walletType: provider,
      };
      
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message || "Failed to connect wallet"
      };
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectWallet = async () => {
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "default",
    });
    return Promise.resolve();
  };

  return {
    isConnecting,
    connectWallet,
    disconnectWallet
  };
}
