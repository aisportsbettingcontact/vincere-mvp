import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { User, Session } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";

const signupSchema = z.object({
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-z0-9_-]+$/, "Username must be lowercase and contain only letters, numbers, hyphens, or underscores"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export default function Auth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Password visibility state
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  // Stay signed in state
  const [staySignedIn, setStaySignedIn] = useState(true);
  
  // Signup form
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPhoneArea, setSignupPhoneArea] = useState("");
  const [signupPhonePrefix, setSignupPhonePrefix] = useState("");
  const [signupPhoneLine, setSignupPhoneLine] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    // Check if user wants to stay signed in
    const shouldStaySignedIn = localStorage.getItem("edgeguide-stay-signed-in");
    if (shouldStaySignedIn !== null) {
      setStaySignedIn(shouldStaySignedIn === "true");
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // When user logs in, redirect to feed and clear age gate flag
        if (session?.user && event === 'SIGNED_IN') {
          localStorage.removeItem("edgeguide-age-accepted");
          navigate("/");
        }
        
        // Handle sign out - clear session if not staying signed in
        if (event === 'SIGNED_OUT') {
          const shouldStaySignedIn = localStorage.getItem("edgeguide-stay-signed-in") === "true";
          if (!shouldStaySignedIn) {
            localStorage.clear();
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If already logged in, redirect to feed
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validatedData = signupSchema.parse({
        username: signupUsername,
        email: signupEmail,
        phone: `${signupPhoneArea}${signupPhonePrefix}${signupPhoneLine}`,
        password: signupPassword
      });

      // Check if username already exists
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', validatedData.username)
        .single();

      if (existingUsername) {
        toast.error("This username is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/`;
      const fullPhone = `+1${validatedData.phone}`;
      
      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: validatedData.username,
            phone: fullPhone
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please login instead.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Account created! Please check your email to verify your account before logging in.", {
          duration: 8000
        });
        // Clear form
        setSignupUsername("");
        setSignupEmail("");
        setSignupPhoneArea("");
        setSignupPhonePrefix("");
        setSignupPhoneLine("");
        setSignupPassword("");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during signup");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validatedData = loginSchema.parse({
        email: loginEmail,
        password: loginPassword
      });

      // Store stay signed in preference
      localStorage.setItem("edgeguide-stay-signed-in", staySignedIn.toString());

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please verify your email before logging in. Check your inbox for the verification link.");
        } else {
          toast.error(error.message);
        }
      } else {
        // Check if email is verified
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !user.email_confirmed_at) {
          await supabase.auth.signOut();
          toast.error("Please verify your email before logging in. Check your inbox for the verification link.");
          return;
        }
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  // If user is logged in, show profile
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#090909" }}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>You are logged in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#090909" }}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stay-signed-in"
                    checked={staySignedIn}
                    onCheckedChange={(checked) => setStaySignedIn(checked as boolean)}
                  />
                  <label
                    htmlFor="stay-signed-in"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    style={{ color: "var(--ma-text-secondary)" }}
                  >
                    Stay signed in
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username *</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone *</Label>
                  <div className="flex items-center justify-start gap-2">
                    <div className="flex items-center justify-center px-3 py-2 rounded-md border border-input bg-muted text-sm font-medium h-10 min-w-[48px]">
                      +1
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground text-base">&#40;</span>
                      <Input
                        id="signup-phone-area"
                        type="tel"
                        placeholder="555"
                        value={signupPhoneArea}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setSignupPhoneArea(val);
                          if (val.length === 3) {
                            document.getElementById('signup-phone-prefix')?.focus();
                          }
                        }}
                        required
                        maxLength={3}
                        className="w-[60px] text-center px-2"
                      />
                      <span className="text-muted-foreground text-base">&#41;</span>
                    </div>
                    <Input
                      id="signup-phone-prefix"
                      type="tel"
                      placeholder="555"
                      value={signupPhonePrefix}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setSignupPhonePrefix(val);
                        if (val.length === 3) {
                          document.getElementById('signup-phone-line')?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && signupPhonePrefix === '') {
                          document.getElementById('signup-phone-area')?.focus();
                        }
                      }}
                      required
                      maxLength={3}
                      className="w-[60px] text-center px-2"
                    />
                    <span className="text-muted-foreground text-base font-medium">-</span>
                    <Input
                      id="signup-phone-line"
                      type="tel"
                      placeholder="1234"
                      value={signupPhoneLine}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setSignupPhoneLine(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && signupPhoneLine === '') {
                          document.getElementById('signup-phone-prefix')?.focus();
                        }
                      }}
                      required
                      maxLength={4}
                      className="w-[72px] text-center px-2"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}