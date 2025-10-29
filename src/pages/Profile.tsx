import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Moon, Sun, Bell, BookOpen, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import draftKingsLogo from "@/assets/draftkings-logo.png";
import circaLogo from "@/assets/circa-logo.svg";
import { User } from "@supabase/supabase-js";

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        setProfile(profileData);
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const formatMemberSince = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ background: "var(--ma-bg)", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "var(--ma-text-primary)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--ma-bg)", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          borderBottom: "1px solid var(--ma-stroke)",
          background: "var(--ma-card)"
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 
            className="text-2xl font-bold font-['Inter',_sans-serif]"
            style={{ color: "var(--ma-text-primary)" }}
          >
            Profile
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* User Info Card */}
        <Card className="mb-6" style={{ background: "var(--ma-card)", borderColor: "var(--ma-stroke)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--ma-text-primary)" }}>
              {profile?.username || "User"}
            </CardTitle>
            <CardDescription style={{ color: "var(--ma-text-secondary)" }}>
              Member Since {profile?.created_at ? formatMemberSince(profile.created_at) : "N/A"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Dark Mode */}
          <Card style={{ background: "var(--ma-card)", borderColor: "var(--ma-stroke)" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Moon className="h-5 w-5" style={{ color: "var(--ma-text-primary)" }} /> : <Sun className="h-5 w-5" style={{ color: "var(--ma-text-primary)" }} />}
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--ma-text-primary)" }}>Dark Mode</h3>
                    <p className="text-sm" style={{ color: "var(--ma-text-secondary)" }}>
                      {theme === "dark" ? "On" : "Off"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card style={{ background: "var(--ma-card)", borderColor: "var(--ma-stroke)" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" style={{ color: "var(--ma-text-primary)" }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--ma-text-primary)" }}>Push Notifications</h3>
                    <p className="text-sm" style={{ color: "var(--ma-text-secondary)" }}>
                      {pushNotifications ? "On" : "Off"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Connected Books */}
          <Card style={{ background: "var(--ma-card)", borderColor: "var(--ma-stroke)" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5" style={{ color: "var(--ma-text-primary)" }} />
                <CardTitle style={{ color: "var(--ma-text-primary)" }}>Connected Books</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* DraftKings */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src={draftKingsLogo} alt="DraftKings" className="h-8 w-8 object-contain" />
                  <div>
                    <h4 className="font-semibold" style={{ color: "var(--ma-text-primary)" }}>DraftKings</h4>
                    <p className="text-sm" style={{ color: "#4ade80" }}>Synced</p>
                  </div>
                </div>
              </div>
              
              <Separator style={{ background: "var(--ma-stroke)" }} />
              
              {/* Circa */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src={circaLogo} alt="Circa" className="h-8 w-8 object-contain" />
                  <div>
                    <h4 className="font-semibold" style={{ color: "var(--ma-text-primary)" }}>Circa</h4>
                    <p className="text-sm" style={{ color: "#4ade80" }}>Synced</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card style={{ background: "var(--ma-card)", borderColor: "var(--ma-stroke)" }}>
            <CardContent className="pt-6">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => toast.info("Settings coming soon")}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span style={{ color: "var(--ma-text-primary)" }}>Settings</span>
              </Button>
            </CardContent>
          </Card>

          {/* Log Out */}
          <Card style={{ background: "var(--ma-card)", borderColor: "var(--ma-stroke)" }}>
            <CardContent className="pt-6">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
