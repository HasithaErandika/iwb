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

  return formattedText;
}

/**
 * Generate error response with helpful fallback information
 * @param {string} query - The original query that failed
 * @param {string} errorMessage - The error message
 * @returns {string} - Formatted error response with fallback tips
 */
export function generateErrorResponse(query, errorMessage) {
  return `Sorry, I encountered an error while processing your request: "${query}". Please try again later.

Error details: ${errorMessage}

In the meantime, here are some general travel tips:
• Check visa requirements for your destination
• Research local customs and etiquette
• Consider travel insurance
• Pack according to the climate and activities planned`;
}

/**
 * Render formatted text with proper styling
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

    // Handle bullet points and list items
    if (line.trim().startsWith("- **")) {
      return (
        <div key={index} className="mb-4">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else if (line.trim().startsWith("- ")) {
      return (
        <div key={index} className="mb-2 ml-4">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else if (line.trim().startsWith("•")) {
      return (
        <div key={index} className="mb-2 ml-4">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    } else {
      return (
        <div key={index} className="mb-2">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        </div>
      );
    }
  });
} 