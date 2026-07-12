import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, integrate Firebase here
    navigate("/dashboard");
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
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

            <button
              type="submit"
              className="w-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 py-2 rounded-md font-medium transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
