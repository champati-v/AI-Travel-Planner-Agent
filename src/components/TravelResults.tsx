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
    <Card className="shadow-xl border">
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
                <p className="text-muted-foreground">{structuredData["Trip Overview"]}</p>
              </CardContent>
            </Card>

            {/* Day-by-Day Itinerary */}
            {Array.isArray(structuredData["Day-by-Day Itinerary"]) && (
              <Card>
                <CardHeader>
                  <CardTitle>📅 Complete Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="text-[16px] space-y-4">
                  {structuredData["Day-by-Day Itinerary"].map((day: any, index: number) => (
                    <Card key={index} className="border">
                      <CardHeader>
                        <CardTitle>{day.Day}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-[16px] space-y-1 text-sm">
                        <p><strong>🌅 Morning:</strong> {day.Morning}</p>
                        <p><strong>🌇 Afternoon:</strong> {day.Afternoon}</p>
                        <p><strong>🌃 Evening:</strong> {day.Evening}</p>
                        {day.Night && <p><strong>🌙 Night:</strong> {day.Night}</p>}
                        {day.Cost && <p><strong>💰 Cost:</strong> {day.Cost}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}


          {[
            ["🏨 Accommodation Recommendations", structuredData["Accommodation Recommendations"]],
            ["🍽️ Food & Dining", structuredData["Food & Dining"]],
            ["📝 Travel Tips", structuredData["Travel Tips"]],
            ["🎒 Packing Suggestions", structuredData["Packing Suggestions"]]
          ].map(([title, items], idx) => (
            Array.isArray(items) && (
              <Card key={idx} className="text-[16px] border">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-[16px] list-inside space-y-1 text-sm">
                    {items.map((item: any, index: number) => (
                      <li key={index}>
                        {typeof item === 'string'
                          ? item
                          : // For object items like accommodation or food
                            Object.entries(item).map(([key, value]) => (
                              <div key={key}>
                                <strong>{key}:</strong> {String(value)}
                              </div>
                            ))
                        }
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          ))}


            {/* Transportation */}
            <Card className="border">
              <CardHeader>
                <CardTitle>🚗 Transportation</CardTitle>
              </CardHeader>
              <CardContent className="text-[16px] space-y-2 text-sm">
                <p>{structuredData.Transportation}</p>
              </CardContent>
            </Card>

            {/* Budget Breakdown */}
            <Card className="border">
              <CardHeader>
                <CardTitle>💸 Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="text-[16px]">
                <ul className="space-y-1 text-sm">
                  {Object.entries(structuredData["Budget Breakdown"]).map(([key, value]: [string, string], index: number) => (
                    <li key={index}><strong>{key}:</strong> {value}</li>
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
