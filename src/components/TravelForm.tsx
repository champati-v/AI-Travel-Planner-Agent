
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { TravelPlan } from "@/pages/Index";
import { cn } from "@/lib/utils";

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
    startDate: null as Date | null,
    endDate: null as Date | null,
    budget: "",
    travelers: "",
    interests: [] as string[]
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

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Dates Required",
        description: "Please select both start and end dates for your trip.",
        variant: "destructive"
      });
      return;
    }

    if (formData.endDate <= formData.startDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after the start date.",
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
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.endDate.toISOString().split('T')[0],
      budget: parseInt(formData.budget),
      travelers: parseInt(formData.travelers),
      interests: formData.interests
    };

    setIsLoading(true);
    
    try {
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl text-foreground">Plan Your Perfect Trip</CardTitle>
        <p className="text-muted-foreground">Fill in your travel preferences and let AI do the rest</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label className="text-sm font-medium">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-2 focus:border-blue-500 transition-colors",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date || null }))}
                    disabled={(date) => date < today}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-2 focus:border-blue-500 transition-colors",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date || null }))}
                    disabled={(date) => {
                      const minDate = formData.startDate ? new Date(formData.startDate.getTime() + 24 * 60 * 60 * 1000) : today;
                      return date < minDate;
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
