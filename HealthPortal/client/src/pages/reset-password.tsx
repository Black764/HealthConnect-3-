import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { RetroGrid } from "@/components/retro-grid";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = window.location.pathname.split("/").pop();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (token) {
        // Reset password
        const res = await fetch(`/api/reset-password/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (!res.ok) throw new Error(await res.text());

        toast({
          title: "Password reset successful",
          description: "You can now login with your new password",
        });
        setLocation("/auth");
      } else {
        // Request password reset
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) throw new Error(await res.text());

        toast({
          title: "Password reset email sent",
          description: "Please check your email for further instructions",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8">
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">
            {token ? "Reset Password" : "Forgot Password"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {token ? (
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : token
                ? "Reset Password"
                : "Send Reset Link"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setLocation("/auth")}
            >
              Back to Login
            </Button>
          </form>
        </Card>
      </div>

      <div className="flex-1 relative overflow-hidden bg-primary">
        <RetroGrid />
        <div className="absolute inset-0 flex items-center justify-center text-primary-foreground p-8">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Secure Password Reset
            </h2>
            <p className="opacity-90">
              We'll help you get back into your account safely and securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
