import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { CampProvider } from "@/contexts/CampContext";
import BottomNavigation from "@/components/BottomNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Welcome from "@/pages/Welcome";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import Camps from "@/pages/Camps";
import CampDetail from "@/pages/CampDetail";
import CreateCamp from "@/pages/CreateCamp";
import Users from "@/pages/Users";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import { UserRole } from "./enums/User";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <CampProvider>
            <div className="min-h-screen bg-camp-background">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/profile/edit" element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } />
                <Route path="/camps" element={
                  <ProtectedRoute>
                    <Camps />
                  </ProtectedRoute>
                } />
                <Route path="/camps/:id" element={
                  <ProtectedRoute>
                    <CampDetail />
                  </ProtectedRoute>
                } />
                <Route path="/camps/create" element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <CreateCamp />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <Users />
                  </ProtectedRoute>
                } />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNavigation />
              <Toaster />
              <Sonner />
            </div>
          </CampProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
