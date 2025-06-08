import { useState } from "react";
import TravelForm from "@/components/TravelForm";
import TravelResults from "@/components/TravelResults";

export interface TravelPlan {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
}

const Index = () => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanGenerated = (plan: TravelPlan) => {
    setTravelPlan(plan);
  };

  const handleReset = () => {
    setTravelPlan(null);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div
          className="text-center rounded-md px-2 py-4 mb-6 mt-10 relative overflow-hidden"
          style={{
            backgroundImage: "url('/scene.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow">
              AI Travel Planner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-white drop-shadow">
              Let our AI create the perfect travel itinerary tailored to your preferences, budget, and interests
            </p>
          </div>
      </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {!travelPlan ? (
            <TravelForm 
              onPlanGenerated={handlePlanGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <TravelResults 
              travelPlan={travelPlan}
              onReset={handleReset}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
