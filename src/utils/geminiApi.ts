import { TravelPlan } from "@/pages/Index";

// Replace this with your actual Gemini API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateTravelPlan = async (travelPlan: TravelPlan): Promise<string> => {
  const prompt = `
You are an expert travel planner AI. Create a detailed, personalized travel itinerary based on the following input:

Trip Details:
- From: ${travelPlan.source}
- To: ${travelPlan.destination}
- Dates: ${travelPlan.startDate} to ${travelPlan.endDate}
- Budget: ₹${travelPlan.budget} INR
- Number of travelers: ${travelPlan.travelers}
- Interests: ${travelPlan.interests.join(', ')}

Return the response **only** as a valid JSON object with the following top-level keys:
1. "tripOverview": { "summary": string }
2. "itinerary": array of {
   "day": string,
   "date": string,
   "activities": array of {
     "time": string,
     "name": string,
     "location": string,
     "description": string,
     "estimatedCost": number
   },
   "dailyTotalCost": number
}
3. "accommodationRecommendations": array of {
   "name": string,
   "location": string,
   "pricePerNight": number,
   "totalCost": number,
   "amenities": array of string
}
4. "transportation": {
   "local": {
     "modes": array of string,
     "estimatedCost": number
   },
   "intercity": {
     "mode": string,
     "provider": string,
     "estimatedCost": number
   }
}
5. "foodAndDining": array of {
   "name": string,
   "type": string,
   "location": string,
   "averageCostPerMeal": number,
   "recommendedDishes": array of string
}
6. "budgetBreakdown": object with keys like "accommodation", "transportation", "food", "activities", "miscellaneous", "total" and their number values
7. "travelTips": array of strings
8. "packingSuggestions": array of strings

⚠️ Do not include any extra text, explanation, markdown, or backtick json wrappers. Just return the JSON object.
`;

  try {
    console.log('Making API request to Gemini...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`, {
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
