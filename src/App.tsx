
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Web3AuthProvider } from "./context/Web3AuthContext";
import { useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import FeedsPage from "./pages/FeedsPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public route that redirects if user is already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Routes component to separate the routing logic
const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/feeds" 
        element={
          <ProtectedRoute>
            <FeedsPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/about" element={<AboutPage />} />
      <Route 
        path="/auth" 
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Web3AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <AppRoutes />
                  </main>
                  <Footer />
                </div>
              </BrowserRouter>
            </Web3AuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
