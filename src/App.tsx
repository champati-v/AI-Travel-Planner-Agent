import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/protectedRoutes";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={user? <Index/> : <AuthForm />} />

          <Route 
            path="/plan"
            element={
             <ProtectedRoute> 
              <Index />
            </ProtectedRoute>
            } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  )
};

export default App;
