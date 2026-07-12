import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { demoLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Attempt real Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-api-key" || err.message.includes("api-key")) {
        console.warn("Firebase not configured. Bypassing login for Demo.");
        demoLogin();
        navigate("/dashboard");
      } else {
        setError(err.message || "Failed to log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-secondary border border-border rounded-full flex items-center justify-center mb-4">
            <span className="text-xl font-bold">AF</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">AssetFlow - Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end">
              <button type="button" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Forgot password
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="text-sm p-4 bg-secondary/50 rounded-lg border border-border">
              <p className="font-medium mb-1">New here?</p>
              <p className="text-muted-foreground text-xs">Sign up creates an employee account. admin roles assigned later</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Create Account / Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
