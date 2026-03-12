import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import '@/i18n';

import Login from "./pages/Login";
import Home from "./pages/Home";
import Itinerary from "./pages/Itinerary";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/itinerary" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><ComingSoon title="Explore" /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><ComingSoon title="Support" /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
