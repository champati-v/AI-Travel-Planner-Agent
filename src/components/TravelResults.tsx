import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateTravelPlan } from "@/utils/geminiApi";
import { TravelPlan } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { DownloadIcon } from "lucide-react";

interface TravelResultsProps {
  travelPlan: TravelPlan;
  onReset: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const TravelResults = ({ travelPlan, onReset, isLoading, setIsLoading }: TravelResultsProps) => {
  const [aiResponse, setAiResponse] = useState<string>("");
  const [structuredData, setStructuredData] = useState<any | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (contentRef.current) {
      html2pdf().set({
        margin: 0.5,
        filename: "ai-response.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      }).from(contentRef.current).save();
    }
  };

  useEffect(() => {
    const fetchTravelPlan = async () => {
      try {
        console.log('Generating travel plan with:', travelPlan);
        const response = await generateTravelPlan(travelPlan);
        console.log('AI Response:', response);
        setAiResponse(response);
        const parsed = JSON.parse(response);
        setStructuredData(parsed);
      } catch (error) {
        console.error('Error fetching travel plan:', error);
        toast({
          title: "Error",
          description: error.message,
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
      <Card className="shadow-xl border border-white/10 backdrop-blur-sm">
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
        <CardHeader className="bg-gradient-to-br from-blue-600 to-purple-500 text-white rounded-t-lg">
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
              className="bg-white/20 hover:bg-white/50 text-white border-white/30"
            >
              Plan New Trip
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 bg-white text-black">
          <div className="space-y-4 flex justify-between items-center">
            <div>
              <h4 className="font-semibold mb-2">Your Interests</h4>
              <div className="flex flex-wrap gap-2">
                {travelPlan.interests.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 border border-blue-800 hover:bg-blue-200"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
              <div className="">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-2 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                   <DownloadIcon />
                </button>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Generated Itinerary */}
    <Card className="shadow-xl border w-full max-w-5xl mx-auto">
  <CardHeader>
    <CardTitle className="text-xl flex items-center">
      <span className="mr-2">🤖</span>
      AI-Generated Travel Itinerary
    </CardTitle>
  </CardHeader>

  <CardContent ref={contentRef}>
    {structuredData ? (
      <div className="space-y-6">

        {/* Trip Overview */}
        <Card className="border">
          <CardHeader>
            <CardTitle>🗺️ Trip Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{structuredData.tripOverview?.summary}</p>
          </CardContent>
        </Card>

        {/* Day-by-Day Itinerary */}
        {Array.isArray(structuredData.itinerary) && (
          <Card className="border">
            <CardHeader>
              <CardTitle>📅 Complete Itinerary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {structuredData.itinerary.map((day: any, index: number) => (
                <Card key={index} className="border">
                  <CardHeader>
                    <CardTitle>{day.day} – {day.date}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {day.activities.map((activity: any, i: number) => (
                      <div key={i} className="border-b pb-2">
                        <p><strong>🕒 Time:</strong> {activity.time}</p>
                        <p><strong>📍 Name:</strong> {activity.name}</p>
                        <p><strong>📌 Location:</strong> {activity.location}</p>
                        <p><strong>📝 Description:</strong> {activity.description}</p>
                        <p><strong>💰 Estimated Cost:</strong> ${activity.estimatedCost}</p>
                      </div>
                    ))}
                    <p className="pt-2 font-semibold">Daily Total Cost: ${day.dailyTotalCost}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Accommodation, Food, Travel Tips, Packing */}
        {[
          ["🏨 Accommodation Recommendations", structuredData.accommodationRecommendations],
          ["🍽️ Food & Dining", structuredData.foodAndDining],
          ["📝 Travel Tips", structuredData.travelTips],
          ["🎒 Packing Suggestions", structuredData.packingSuggestions]
        ].map(([title, items], idx) => (
          Array.isArray(items) && (
            <Card key={idx} className="border">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ul className="list-disc list-inside space-y-2">
                  {items.map((item: any, index: number) => (
                    <li key={index}>
                      {typeof item === 'string' ? (
                        item
                      ) : (
                        <div className="space-y-1">
                          {Object.entries(item).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}</p>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        ))}

        {/* Transportation */}
        {structuredData.transportation && (
          <Card className="border">
            <CardHeader>
              <CardTitle>🚗 Transportation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <p className="font-semibold">Local Transport:</p>
                <p><strong>Modes:</strong> {structuredData.transportation.local.modes.join(', ')}</p>
                <p><strong>Estimated Cost:</strong> ${structuredData.transportation.local.estimatedCost}</p>
              </div>
              <div>
                <p className="font-semibold">Intercity Transport:</p>
                <p><strong>Mode:</strong> {structuredData.transportation.intercity.mode}</p>
                <p><strong>Provider:</strong> {structuredData.transportation.intercity.provider}</p>
                <p><strong>Estimated Cost:</strong> ${structuredData.transportation.intercity.estimatedCost}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Breakdown */}
        <Card className="border">
          <CardHeader>
            <CardTitle>💸 Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1">
              {Object.entries(structuredData.budgetBreakdown).map(([key, value], index: number) => (
                <li key={index}><strong>{key}:</strong> ${String(value)}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>
    ) : (
      <div className="whitespace-pre-wrap text-foreground leading-relaxed">
        <ReactMarkdown>{aiResponse}</ReactMarkdown>
      </div>
    )}
  </CardContent>
    </Card>


      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={onReset}
          variant="outline"
          className="border-2 border-blue-600 text-blue-600"
        >
          Plan Another Trip
        </Button>
      </div>
    </div>
  );
};

export default TravelResults;
