// Chat API utilities
const CHAT_API_URL = "http://localhost:8080/api/chat";

/**
 * Send a chat message to the API
 * @param {string} message - The message to send
 * @returns {Promise<Object>} - The API response
 */
export async function sendChatMessage(message) {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.success === false) {
    throw new Error(data.message || "Failed to get response");
  }

  return data;
}

/**
 * Format the chat response to be more informative like Perplexity AI
 * @param {Object} data - The API response data
 * @param {string} query - The original query
 * @returns {string} - The formatted response
 */
export function formatPerplexityResponse(data, query) {
  let formattedText = "";

  if (data.answer) {
    formattedText = data.answer;
  } else if (data.content) {
    formattedText = data.content;
  } else if (data.response) {
    formattedText = data.response;
  } else {
    formattedText = JSON.stringify(data, null, 2);
  }

  // Add emojis and enhance formatting for better readability
  formattedText = enhanceResponseWithEmojis(formattedText, query);
  
  return formattedText;
}

/**
 * Enhance response with emojis and better formatting
 * @param {string} text - The response text
 * @param {string} query - The original query
 * @returns {string} - Enhanced text with emojis
 */
function enhanceResponseWithEmojis(text, query) {
  const queryLower = query.toLowerCase();
  
  // Add relevant emojis based on query content
  if (queryLower.includes('colombo') || queryLower.includes('capital')) {
    text = text.replace(/^/, '🏙️ ');
  } else if (queryLower.includes('kandy') || queryLower.includes('cultural')) {
    text = text.replace(/^/, '🏛️ ');
  } else if (queryLower.includes('galle') || queryLower.includes('coastal')) {
    text = text.replace(/^/, '🏖️ ');
  } else if (queryLower.includes('food') || queryLower.includes('cuisine')) {
    text = text.replace(/^/, '🍽️ ');
  } else if (queryLower.includes('transport') || queryLower.includes('travel')) {
    text = text.replace(/^/, '🚗 ');
  } else if (queryLower.includes('visa') || queryLower.includes('requirements')) {
    text = text.replace(/^/, '📋 ');
  } else if (queryLower.includes('cost') || queryLower.includes('price')) {
    text = text.replace(/^/, '💰 ');
  } else if (queryLower.includes('safety') || queryLower.includes('security')) {
    text = text.replace(/^/, '🛡️ ');
  } else if (queryLower.includes('weather') || queryLower.includes('climate')) {
    text = text.replace(/^/, '🌤️ ');
  } else if (queryLower.includes('coworking') || queryLower.includes('work')) {
    text = text.replace(/^/, '💼 ');
  } else {
    text = text.replace(/^/, '🌟 ');
  }

  // Add section emojis for better structure
  text = text
    .replace(/\*\*(.*?)\*\*/g, '**$1** ✨')
    .replace(/^(\s*[-•]\s*)/gm, '$1📍 ')
    .replace(/(\d+\.\s*)/g, '$1🎯 ')
    .replace(/(Tips?:)/gi, '$1 💡')
    .replace(/(Best time:)/gi, '$1 ⏰')
    .replace(/(Cost:)/gi, '$1 💰')
    .replace(/(Location:)/gi, '$1 📍')
    .replace(/(Contact:)/gi, '$1 📞');

  return text;
}

/**
 * Generate error response with helpful fallback information
 * @param {string} query - The original query that failed
 * @param {string} errorMessage - The error message
 * @returns {string} - Formatted error response with fallback tips
 */
export function generateErrorResponse(query, errorMessage) {
  return `😔 Sorry, I encountered an error while processing your request: "${query}". Please try again later.

**Error details:** ${errorMessage}

**💡 In the meantime, here are some general travel tips for Sri Lanka:**

📍 **Visa Requirements**
• Most nationalities can get a 30-day tourist visa on arrival
• Apply online at eta.gov.lk for convenience
• Cost is approximately $35 USD

🌤️ **Best Time to Visit**
• December to April: Dry season, perfect for beach activities
• May to September: Monsoon season, great for cultural sites
• October to November: Inter-monsoon period

💰 **Cost of Living**
• Budget accommodation: $15-30 USD/night
• Mid-range accommodation: $30-80 USD/night
• Food: $5-15 USD/day
• Transportation: $1-5 USD/day

🛡️ **Safety Tips**
• Sri Lanka is generally safe for travelers
• Use common sense in tourist areas
• Keep valuables secure
• Follow local customs and dress modestly

💼 **Digital Nomad Essentials**
• Reliable internet available in major cities
• Coworking spaces in Colombo and Kandy
• SIM cards available at airport
• Power adapters needed (Type D, G, M)`;
}

/**
 * Render formatted text with proper styling and enhanced visual elements
 * @param {string} text - The text to render
 * @returns {Array} - Array of JSX elements
 */
export function renderFormattedText(text) {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    if (line.trim() === "") {
      return <br key={index} />;
    }

    // Process bold text (**text**)
    const processedLine = line.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Handle different line types with enhanced styling
    if (line.trim().startsWith("- **") || line.trim().startsWith("📍 - **")) {
      return (
        <div key={index} className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div
            className="text-gray-800 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else if (line.trim().startsWith("- ") || line.trim().startsWith("📍 ")) {
      return (
        <div key={index} className="mb-3 ml-4 p-2 bg-gray-50 rounded-lg">
          <div
            className="text-gray-700 leading-relaxed flex items-start gap-2"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else if (line.trim().startsWith("•")) {
      return (
        <div key={index} className="mb-2 ml-4 p-2 bg-green-50 rounded-lg">
          <div
            className="text-gray-700 leading-relaxed flex items-start gap-2"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else if (line.trim().startsWith("🎯") || line.trim().startsWith("💡") || line.trim().startsWith("⏰") || line.trim().startsWith("💰") || line.trim().startsWith("📍") || line.trim().startsWith("📞")) {
      return (
        <div key={index} className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div
            className="text-gray-800 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else if (line.trim().startsWith("🌟") || line.trim().startsWith("🏙️") || line.trim().startsWith("🏛️") || line.trim().startsWith("🏖️") || line.trim().startsWith("🍽️") || line.trim().startsWith("🚗") || line.trim().startsWith("📋") || line.trim().startsWith("🛡️") || line.trim().startsWith("🌤️") || line.trim().startsWith("💼")) {
      return (
        <div key={index} className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
          <div
            className="text-gray-900 leading-relaxed text-lg font-medium"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else {
      return (
        <div key={index} className="mb-3">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    }
  });
}

/**
 * Generate smart suggestions based on user query
 * @param {string} query - The user's query
 * @returns {Array} - Array of suggestion objects
 */
export function generateSmartSuggestions(query) {
  const queryLower = query.toLowerCase();
  const suggestions = [];

  if (queryLower.includes('colombo')) {
    suggestions.push(
      "Best coworking spaces in Colombo",
      "Top restaurants in Colombo",
      "Transportation in Colombo",
      "Safety tips for Colombo"
    );
  } else if (queryLower.includes('kandy')) {
    suggestions.push(
      "Temple of the Tooth in Kandy",
      "Cultural experiences in Kandy",
      "Best time to visit Kandy",
      "Accommodation in Kandy"
    );
  } else if (queryLower.includes('galle')) {
    suggestions.push(
      "Galle Fort walking tour",
      "Beach activities in Galle",
      "Best cafes in Galle",
      "Day trips from Galle"
    );
  } else if (queryLower.includes('visa')) {
    suggestions.push(
      "Visa application process",
      "Required documents",
      "Visa extension options",
      "Digital nomad visa"
    );
  } else if (queryLower.includes('cost') || queryLower.includes('budget')) {
    suggestions.push(
      "Daily budget breakdown",
      "Accommodation costs",
      "Food expenses",
      "Transportation costs"
    );
  } else {
    suggestions.push(
      "Best places to work remotely",
      "Local food recommendations",
      "Transportation options",
      "Safety tips for travelers"
    );
  }

  return suggestions.slice(0, 4);
} 