import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Medicine } from "@shared/schema";
import { Pill } from "lucide-react";
import { RetroGrid } from "@/components/retro-grid";

export default function PharmacyPage() {
  const [, setLocation] = useLocation();
  const { data: medicines } = useQuery<Medicine[]>({
    queryKey: ["/api/medicines"],
  });

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

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Online Pharmacy</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines?.map((medicine) => (
              <Card key={medicine.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    {medicine.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {medicine.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>Dosage: {medicine.dosage}</p>
                    <p>Price: ${Number(medicine.price).toFixed(2)}</p>
                    {medicine.requiresPrescription && (
                      <p className="text-yellow-600">Requires Prescription</p>
                    )}
                    {!medicine.inStock && (
                      <p className="text-red-500">Out of Stock</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    disabled={!medicine.inStock || medicine.requiresPrescription}
                    onClick={() => setLocation(`/pharmacy/order/${medicine.id}`)}
                  >
                    {medicine.requiresPrescription 
                      ? "Prescription Required" 
                      : medicine.inStock 
                        ? "Purchase" 
                        : "Out of Stock"
                    }
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-primary hidden lg:block">
        <RetroGrid />
        <div className="absolute inset-0 flex items-center justify-center text-primary-foreground p-8">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Licensed Online Pharmacy
            </h2>
            <p className="opacity-90">
              We are a fully licensed online pharmacy providing safe and reliable access to medications. 
              All prescriptions are verified by licensed pharmacists before dispensing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
