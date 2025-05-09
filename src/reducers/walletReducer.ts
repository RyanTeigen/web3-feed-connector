
import { WalletType } from "@/hooks/useWalletConnection";

export interface WalletState {
  walletAddress: string | null;
  walletType: WalletType;
  chainId: number | null;
  loading: boolean;
}

export type WalletAction =
  | { type: 'SET_WALLET'; payload: { address: string; type: WalletType; chainId: number } }
  | { type: 'DISCONNECT_WALLET' }
  | { type: 'SET_LOADING'; payload: boolean };

export function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_WALLET':
      return {
        ...state,
        walletAddress: action.payload.address,
        walletType: action.payload.type,
        chainId: action.payload.chainId,
        loading: false
      };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        walletAddress: null,
        walletType: null,
        chainId: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}
