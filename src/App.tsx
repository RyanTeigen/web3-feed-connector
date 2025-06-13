
import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Web3AuthProvider } from "@/context/Web3AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import AboutPage from "@/pages/AboutPage";
import FeedsPage from "@/pages/FeedsPage";
import SentimentDashboard from "@/pages/SentimentDashboard";
import AuthPage from "@/pages/AuthPage";
import ProductionDashboard from "@/pages/ProductionDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import FeedCustomizationPage from "@/pages/FeedCustomizationPage";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Hide bottom nav on auth page
  const hideBottomNav = location.pathname === '/auth';

  return (
    <>
      {!isMobile && <Navbar />}
      <div className={`${isMobile ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feeds" element={<FeedsPage />} />
          <Route path="/feed-customization" element={<FeedCustomizationPage />} />
          <Route path="/sentiment" element={<SentimentDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProductionDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isMobile && <Footer />}
      {isMobile && !hideBottomNav && <MobileBottomNav />}
      <Toaster />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Short delay to simulate checking session
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Web3AuthProvider>
            <Router>
              {loading ? (
                <div className="grid h-screen place-items-center">
                  <span className="loader"></span>
                </div>
              ) : (
                <AppContent />
              )}
            </Router>
          </Web3AuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
