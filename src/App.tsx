import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

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
        <button onClick={() => navigate("/")} style={{ color: location.pathname === "/" ? "#6F74FF" : "#7C7C7C" }}>
          <Zap className="w-6 h-6" />
        </button>
        <button onClick={() => navigate("/auth")} style={{ color: location.pathname === "/auth" ? "#6F74FF" : "#7C7C7C" }}>
          <User className="w-6 h-6" />
        </button>
      </BottomNavigation>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AgeGateModal />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
