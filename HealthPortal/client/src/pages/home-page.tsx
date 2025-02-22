import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { AnimatedBackground } from "@/components/animated-background";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10">
        <header className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">HealthConnect</h1>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setLocation("/pharmacy")}
            >
              Online Pharmacy
            </Button>
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Welcome to HealthConnect, {user?.username}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Access professional medical consultations and licensed pharmacy services.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setLocation("/consultation")}
              >
                Start Consultation
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setLocation("/pharmacy")}
              >
                Browse Medicines
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}