import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertConsultationSchema, type InsertConsultation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export function ConsultationForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertConsultation>({
    resolver: zodResolver(insertConsultationSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertConsultation) => {
      const res = await apiRequest("POST", "/api/consultations", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Consultation request submitted",
        description: "A medical professional will review your case shortly."
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit consultation",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="p-6">
      <form 
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...form.register("age", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              {...form.register("height", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              {...form.register("weight", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type (Optional)</Label>
            <Select onValueChange={(value) => form.setValue("bloodType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptoms">Describe your symptoms</Label>
          <Textarea
            id="symptoms"
            rows={5}
            {...form.register("symptoms")}
            placeholder="Please describe your symptoms in detail..."
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Submit Consultation Request
        </Button>
      </form>
    </Card>
  );
}