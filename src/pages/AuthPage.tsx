
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useWeb3Auth } from "@/context/Web3AuthContext";
import { Wallet } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { connectWallet, isConnecting } = useWeb3Auth();

  // Get the current URL for redirect
  const getCurrentUrl = () => {
    // In a Lovable environment, we need to use the deployed URL, not localhost
    const url = window.location.origin;
    return url;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs before attempting authentication
    if (!email || !email.includes('@') || !password) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid email and password",
      });
      return;
    }

    // Minimum password length check
    if (activeTab === "signup" && password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long",
      });
      return;
    }
    
    setLoading(true);

    try {
      if (activeTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Login successful",
          description: "Welcome back to Autheo!",
        });
        
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: email.split("@")[0],
              full_name: "",
            },
            // Add explicit emailRedirectTo to ensure proper redirect
            emailRedirectTo: `${getCurrentUrl()}/auth/callback`,
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Sign up successful",
          description: "Welcome to Autheo! Please verify your email if required.",
        });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = async (provider: 'metamask' | 'walletconnect' | 'coinbase') => {
    try {
      await connectWallet(provider);
      // No need to navigate as the Web3AuthProvider will handle session updates
      // and the protected route will automatically redirect
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        variant: "destructive",
        title: "Wallet connection error",
        description: error.message || "Failed to connect wallet"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="stars-container absolute inset-0 overflow-hidden" />
      
      <Card className="w-full max-w-md border border-border/50 bg-card/95 backdrop-blur p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b6c63bd0-85fc-4221-b7f4-f2a40f8901d5.png" 
              alt="Autheo Logo" 
              className="h-8 w-auto" 
            />
            <h1 className="text-2xl font-bold">Autheo</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHelp(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              Help
            </Button>
            <ThemeToggle />
          </div>
        </div>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 web3-button" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span> 
                  {activeTab === "login" ? "Logging in..." : "Signing up..."}
                </span>
              ) : (
                activeTab === "login" ? "Login" : "Sign Up"
              )}
            </Button>
          </form>
        </Tabs>
        
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>
        
        <div className="space-y-3">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleWalletConnect('metamask')}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <span className="animate-spin mr-1">⟳</span>
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {isConnecting ? "Connecting..." : "Connect with Web3 Wallet"}
          </Button>
        </div>
        
        <p className="text-center mt-6 text-sm text-muted-foreground">
          {activeTab === "login" 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <button 
            onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
            className="underline text-web3-vibrant-teal hover:text-web3-vibrant-teal/80"
          >
            {activeTab === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </Card>

      <Sheet open={showHelp} onOpenChange={setShowHelp}>
        <SheetContent>
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold">Authentication Help</h2>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Authentication Options</h3>
              <p className="text-sm">
                Autheo supports multiple authentication methods:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-2 mt-2">
                <li>Traditional email and password</li>
                <li>Web3 wallet connection (MetaMask, WalletConnect, Coinbase Wallet)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Using Web3 Authentication</h3>
              <p className="text-sm">
                When connecting with a Web3 wallet:
              </p>
              <ol className="text-sm list-decimal pl-5 space-y-2 mt-2">
                <li>Click "Connect with Web3 Wallet"</li>
                <li>Select your preferred wallet provider</li>
                <li>Approve the connection request in your wallet</li>
                <li>Sign the message to verify your ownership</li>
              </ol>
            </div>
            
            <div className="space-y-2 mt-4">
              <h3 className="font-semibold">Supabase URL Configuration</h3>
              <p className="text-sm">
                If you're experiencing connection issues, make sure your Supabase project has the correct URL configuration:
              </p>
              <ol className="text-sm list-decimal pl-5 space-y-2 mt-2">
                <li>Go to the Supabase dashboard for your project</li>
                <li>Navigate to Authentication &gt; URL Configuration</li>
                <li>Update the Site URL to your Lovable project URL (not localhost)</li>
                <li>Add your Lovable project URL to the Redirect URLs list</li>
                <li>Save the changes</li>
              </ol>
              <p className="text-sm mt-2">
                Your Lovable preview URL should be something like: 
                <code className="px-1 bg-muted rounded text-xs ml-1">
                  {window.location.origin}
                </code>
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <h3 className="font-semibold">Common Issues</h3>
              <ul className="text-sm list-disc pl-5 space-y-2">
                <li>Email verification might be required for new accounts</li>
                <li>Check your email spam folder for verification emails</li>
                <li>Password must be at least 6 characters long</li>
                <li>Ensure your wallet is connected to the correct network</li>
                <li>For MetaMask issues, try resetting your account in MetaMask settings</li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AuthPage;
