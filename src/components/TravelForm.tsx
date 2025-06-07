
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { TravelPlan } from "@/pages/Index";

interface TravelFormProps {
  onPlanGenerated: (plan: TravelPlan) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const interestOptions = [
  "Adventure Sports", "Cultural Sites", "Food & Dining", "Nightlife",
  "Nature & Wildlife", "Photography", "Shopping", "Museums",
  "Beaches", "Historical Sites", "Art Galleries", "Local Markets"
];

const TravelForm = ({ onPlanGenerated, isLoading, setIsLoading }: TravelFormProps) => {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "",
    interests: [] as string[],
    apiKey: ""
  });

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to generate travel plans.",
        variant: "destructive"
      });
      return;
    }

    if (formData.interests.length === 0) {
      toast({
        title: "Select Interests",
        description: "Please select at least one interest to personalize your trip.",
        variant: "destructive"
      });
      return;
    }

    const travelPlan: TravelPlan = {
      source: formData.source,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: parseInt(formData.budget),
      travelers: parseInt(formData.travelers),
      interests: formData.interests
    };

    setIsLoading(true);
    
    try {
      // Store API key in localStorage for this session
      localStorage.setItem('gemini-api-key', formData.apiKey);
      onPlanGenerated(travelPlan);
    } catch (error) {
      console.error('Error generating travel plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl text-foreground">Plan Your Perfect Trip</CardTitle>
        <p className="text-muted-foreground">Fill in your travel preferences and let AI do the rest</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium">
              Gemini API Key *
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Gemini API key"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              className="border-2 focus:border-blue-500 transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground">
              Get your free API key from{" "}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source */}
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">From *</Label>
              <Input
                id="source"
                placeholder="e.g., New York, NY"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="border-2 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium">To *</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                className="border-2 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="border-2 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="border-2 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 2000"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="border-2 focus:border-blue-500 transition-colors"
                required
                min="1"
              />
            </div>

            {/* Travelers */}
            <div className="space-y-2">
              <Label htmlFor="travelers" className="text-sm font-medium">Number of Travelers *</Label>
              <Input
                id="travelers"
                type="number"
                placeholder="e.g., 2"
                value={formData.travelers}
                onChange={(e) => setFormData(prev => ({ ...prev, travelers: e.target.value }))}
                className="border-2 focus:border-blue-500 transition-colors"
                required
                min="1"
                max="20"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Interests * (Select at least one)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label 
                    htmlFor={interest} 
                    className="text-sm cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg transition-all duration-200 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Your Perfect Trip...
              </div>
            ) : (
              "✈️ Generate My Travel Plan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelForm;
