
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { generateTravelPlan } from "@/utils/geminiApi";
import { TravelPlan } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

interface TravelResultsProps {
  travelPlan: TravelPlan;
  onReset: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const TravelResults = ({ travelPlan, onReset, isLoading, setIsLoading }: TravelResultsProps) => {
  const [aiResponse, setAiResponse] = useState<string>("");

  useEffect(() => {
    const fetchTravelPlan = async () => {
      try {
        const apiKey = localStorage.getItem('gemini-api-key');
        if (!apiKey) {
          toast({
            title: "API Key Missing",
            description: "Please enter your Gemini API key.",
            variant: "destructive"
          });
          onReset();
          return;
        }

        console.log('Generating travel plan with:', travelPlan);
        const response = await generateTravelPlan(travelPlan, apiKey);
        console.log('AI Response:', response);
        setAiResponse(response);
      } catch (error) {
        console.error('Error fetching travel plan:', error);
        toast({
          title: "Error",
          description: "Failed to generate travel plan. Please check your API key and try again.",
          variant: "destructive"
        });
        onReset();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelPlan();
  }, [travelPlan, onReset, setIsLoading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    const start = new Date(travelPlan.startDate);
    const end = new Date(travelPlan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Creating Your Perfect Trip</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Our AI is analyzing your preferences and crafting a personalized travel itinerary just for you...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trip Overview */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">
                {travelPlan.source} → {travelPlan.destination}
              </CardTitle>
              <p className="opacity-90">
                {formatDate(travelPlan.startDate)} - {formatDate(travelPlan.endDate)}
              </p>
              <p className="opacity-90">
                {getDuration()} days • {travelPlan.travelers} traveler{travelPlan.travelers > 1 ? 's' : ''} • ${travelPlan.budget.toLocaleString()} budget
              </p>
            </div>
            <Button 
              variant="secondary" 
              onClick={onReset}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Plan New Trip
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Your Interests</h4>
              <div className="flex flex-wrap gap-2">
                {travelPlan.interests.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Generated Itinerary */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="mr-2">🤖</span>
            AI-Generated Travel Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiResponse ? (
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {aiResponse}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={onReset}
          variant="outline"
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Plan Another Trip
        </Button>
      </div>
    </div>
  );
};

export default TravelResults;
