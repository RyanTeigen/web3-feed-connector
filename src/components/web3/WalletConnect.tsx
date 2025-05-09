
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWeb3Auth } from "@/context/Web3AuthContext";
import { Loader2, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const WalletConnect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connectWallet, isConnecting, walletAddress, walletType, disconnectWallet } = useWeb3Auth();

  const handleConnect = async (provider: 'metamask' | 'walletconnect' | 'coinbase') => {
    setError(null);
    try {
      await connectWallet(provider);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  return (
    <>
      {walletAddress ? (
        <Button 
          onClick={disconnectWallet}
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-web3-vibrant-teal/20 to-web3-deep-purple/20 border-web3-vibrant-teal/40"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline">
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </span>
          <span className="md:hidden">
            {walletAddress.substring(0, 4)}...
          </span>
        </Button>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="web3-button"
        >
          Connect Wallet
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect your wallet</DialogTitle>
            <DialogDescription>
              Connect your preferred wallet to access Web3 features.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <Card 
              className="cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={() => handleConnect('metamask')}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-background rounded-full p-2 border border-input">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                      alt="MetaMask" 
                      className="h-8 w-8" 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">MetaMask</h3>
                    <p className="text-xs text-muted-foreground">Connect using your browser wallet</p>
                  </div>
                </div>
                {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors opacity-70">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-background rounded-full p-2 border border-input">
                    <img 
                      src="https://avatars.githubusercontent.com/u/37784886?s=200&v=4" 
                      alt="WalletConnect" 
                      className="h-8 w-8" 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">WalletConnect</h3>
                    <p className="text-xs text-muted-foreground">Connect using your mobile wallet (Coming Soon)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors opacity-70">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-background rounded-full p-2 border border-input">
                    <img 
                      src="https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0" 
                      alt="Coinbase Wallet" 
                      className="h-8 w-8" 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Coinbase Wallet</h3>
                    <p className="text-xs text-muted-foreground">Connect using Coinbase Wallet (Coming Soon)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
