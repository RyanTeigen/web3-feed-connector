
import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import AboutPage from "@/pages/AboutPage";
import FeedsPage from "@/pages/FeedsPage";
import SentimentDashboard from "@/pages/SentimentDashboard";
import AuthPage from "@/pages/AuthPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import FeedCustomizationPage from "@/pages/FeedCustomizationPage";

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
    <ThemeProvider>
      <Router>
        {loading ? (
          <div className="grid h-screen place-items-center">
            <span className="loader"></span>
          </div>
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/feeds" element={<FeedsPage />} />
              <Route path="/feed-customization" element={<FeedCustomizationPage />} />
              <Route path="/sentiment" element={<SentimentDashboard />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <Toaster />
          </>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
