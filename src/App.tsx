import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { CampProvider } from "@/contexts/CampContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LiffProvider } from "@/contexts/LiffContext";
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
import EditCamp from "@/pages/EditCamp";
import CampParticipants from "@/pages/CampParticipants";
import { UserRole } from "./enums/User";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <LiffProvider>
          <LanguageProvider>
            <AuthProvider>
              <CampProvider>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-camp-light relative">
                  {/* Background decoration elements */}
                  <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                  <div className="absolute top-40 right-10 w-60 h-60 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                  <div className="absolute bottom-40 left-20 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                  
                  {/* Main content with glass effect */}
                  <div className="relative min-h-screen">
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
                      <Route path="/camps/:id/edit" element={
                        <ProtectedRoute requiredRole={UserRole.ADMIN}>
                          <EditCamp />
                        </ProtectedRoute>
                      } />
                      <Route path="/camps/:id/participants" element={
                        <ProtectedRoute requiredRole={UserRole.ADMIN}>
                          <CampParticipants />
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
                    {import.meta.env.DEV && (
                      <div className="fixed bottom-0 right-0 bg-black text-white p-2 z-50">
                        <span className="sm:hidden">xs</span>
                        <span className="hidden sm:inline md:hidden">sm</span>
                        <span className="hidden md:inline lg:hidden">md</span>
                        <span className="hidden lg:inline xl:hidden">lg</span>
                        <span className="hidden xl:inline 2xl:hidden">xl</span>
                        <span className="hidden 2xl:inline">2xl</span>
                      </div>
                    )}
                  </div>
                </div>
              </CampProvider>
            </AuthProvider>
          </LanguageProvider>
        </LiffProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
