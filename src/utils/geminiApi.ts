import { TravelPlan } from "@/pages/Index";

// Replace this with your actual Gemini API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateTravelPlan = async (travelPlan: TravelPlan): Promise<string> => {
  const prompt = `
You are an expert travel planner AI. Create a detailed, personalized travel itinerary based on the following information:

**Trip Details:**
- From: ${travelPlan.source}
- To: ${travelPlan.destination}
- Dates: ${travelPlan.startDate} to ${travelPlan.endDate}
- Budget: $${travelPlan.budget} USD
- Number of travelers: ${travelPlan.travelers}
- Interests: ${travelPlan.interests.join(', ')}

**Please provide:**
1. **Trip Overview** - Brief summary of the trip
2. **Day-by-Day Itinerary** - Detailed daily schedule with activities, timing, and estimated costs
3. **Accommodation Recommendations** - Hotels/stays within budget
4. **Transportation** - Best ways to get around locally and between cities
5. **Food & Dining** - Restaurant recommendations based on interests and budget
6. **Budget Breakdown** - Estimated costs for different categories
7. **Travel Tips** - Specific advice for this destination
8. **Packing Suggestions** - What to bring based on season and activities

Make sure all recommendations align with the specified interests and stay within the budget. Be specific with names of places, restaurants, and attractions when possible. Consider the travel dates for seasonal activities and weather.

Format the response in a clear, easy-to-read structure with proper headings and bullet points.
`;

  try {
    console.log('Making API request to Gemini...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      throw new Error(`API request failed: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
