
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useWalletConnection, WalletType } from '@/hooks/useWalletConnection';
import { walletReducer, WalletState, WalletAction } from '@/reducers/walletReducer';

interface IWeb3AuthContext {
  isConnecting: boolean;
  connectWallet: (provider: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  walletAddress: string | null;
  walletType: WalletType;
  chainId: number | null;
}

const initialState: WalletState = {
  walletAddress: null,
  walletType: null,
  chainId: null,
  loading: false
};

const Web3AuthContext = createContext<IWeb3AuthContext | undefined>(undefined);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const { user } = useAuth();
  const { isConnecting, connectWallet: connectWalletHook, disconnectWallet: disconnectWalletHook } = useWalletConnection();

  // Load saved wallet connection
  useEffect(() => {
    if (user) {
      const loadWalletConnection = async () => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const { data } = await supabase
            .from('wallet_connections')
            .select('*')
            .eq('user_id', user.id)
            .order('last_connected_at', { ascending: false })
            .limit(1)
            .single();
            
          if (data) {
            dispatch({
              type: 'SET_WALLET',
              payload: {
                address: data.wallet_address,
                type: data.wallet_type,
                chainId: data.chain_id
              }
            });
          } else {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } catch (error) {
          console.error('Error loading wallet connection:', error);
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      };
      
      loadWalletConnection();
    } else {
      // Reset wallet state when user logs out
      dispatch({ type: 'DISCONNECT_WALLET' });
    }
  }, [user]);

  const connectWalletContext = async (provider: WalletType) => {
    const result = await connectWalletHook(provider);
    
    if (result.success && result.address && result.chainId && result.walletType) {
      dispatch({
        type: 'SET_WALLET',
        payload: {
          address: result.address,
          type: result.walletType,
          chainId: result.chainId
        }
      });
    }
  };
  
  const disconnectWalletContext = async () => {
    await disconnectWalletHook();
    dispatch({ type: 'DISCONNECT_WALLET' });
  };

  return (
    <Web3AuthContext.Provider
      value={{
        isConnecting,
        connectWallet: connectWalletContext,
        disconnectWallet: disconnectWalletContext,
        walletAddress: state.walletAddress,
        walletType: state.walletType,
        chainId: state.chainId,
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
