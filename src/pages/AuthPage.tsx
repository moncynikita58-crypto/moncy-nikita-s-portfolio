import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({ title: "Account created!", description: "You can now sign in." });
        setIsSignUp(false);
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/admin");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-16">
        <div className="container mx-auto max-w-md px-6">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
            {isSignUp ? "Create Account" : "Admin Sign In"}
          </h1>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Full Name</label>
                <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-semibold">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AuthPage;
