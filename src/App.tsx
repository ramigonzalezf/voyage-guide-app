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
import Onboarding from "./pages/Onboarding";
import ServiceDetail from "./pages/ServiceDetail";
import Documents from "./pages/Documents";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PostLoginRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  const onboarded = localStorage.getItem('onboarding_complete');
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/home" element={<PostLoginRoute><Home /></PostLoginRoute>} />
      <Route path="/itinerary" element={<PostLoginRoute><Itinerary /></PostLoginRoute>} />
      <Route path="/service/:serviceId" element={<PostLoginRoute><ServiceDetail /></PostLoginRoute>} />
      <Route path="/documents" element={<PostLoginRoute><Documents /></PostLoginRoute>} />
      <Route path="/explore" element={<PostLoginRoute><Documents /></PostLoginRoute>} />
      <Route path="/support" element={<PostLoginRoute><Support /></PostLoginRoute>} />
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
