import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Feed from "./pages/Feed";
import Prices from "./pages/Prices";
import Splits from "./pages/Splits";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "./components/BottomNav";
import AgeGateModal from "./components/AgeGateModal";
import { Zap, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You must be logged in to view the Betting Splits feed");
      navigate("/auth");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/splits" element={<Splits />} />
        <Route path="/auth" element={<Auth />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNavigation>
        <button onClick={handleHomeClick} style={{ color: location.pathname === "/" ? "#6F74FF" : "#7C7C7C" }}>
          <Zap className="w-6 h-6" />
        </button>
        <button onClick={() => navigate("/auth")} style={{ color: location.pathname === "/auth" ? "#6F74FF" : "#7C7C7C" }}>
          <User className="w-6 h-6" />
        </button>
      </BottomNavigation>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <AgeGateModal />
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
