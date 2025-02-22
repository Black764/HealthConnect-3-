import { ConsultationForm } from "@/components/consultation-form";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { RetroGrid } from "@/components/retro-grid";

export default function ConsultationPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-8"
        >
          ← Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Medical Consultation Request</h1>
          <ConsultationForm />
        </div>
      </div>

      <div className="flex-1 relative bg-primary hidden lg:block">
        <RetroGrid />
        <div className="absolute inset-0 flex items-center justify-center text-primary-foreground p-8">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Your Privacy Matters
            </h2>
            <p className="opacity-90">
              All information is encrypted and handled according to HIPAA guidelines.
              Only licensed medical professionals will review your consultation request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}