import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import PartnersPage from "./pages/PartnersPage";
import ClientsPage from "./pages/ClientsPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import SocialPage from "./pages/SocialPage";
import ContactsPage from "./pages/ContactsPage";
import CareersPage from "./pages/CareersPage";
import CareerApplyPage from "./pages/CareerApplyPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import InvitationPage from "./pages/InvitationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:id" element={<CareerApplyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/invitation" element={<InvitationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
