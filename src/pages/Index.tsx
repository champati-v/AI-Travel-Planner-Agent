
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            AI Travel Planner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let our AI create the perfect travel itinerary tailored to your preferences, budget, and interests
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
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
