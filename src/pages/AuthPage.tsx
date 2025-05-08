
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Sign up successful",
          description: "Welcome to Autheo! Please verify your email if required.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
      });
    } finally {
      setLoading(false);
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
          <ThemeToggle />
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
    </div>
  );
};

export default AuthPage;
