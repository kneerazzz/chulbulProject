import axios from 'axios';
import { ApiError } from './apiError.js';

const geminiApiUrl = process.env.GEMINI_API_URL;
const geminiApiKey = process.env.GEMINI_API_KEY;

// In-memory cache
const descriptionCache = new Map();

// Rate limiter store
let requestTimestamps = [];

/**
 * Enhanced Gemini client with structured output support
 */
export const geminiClient = async (prompt, options = {}) => {
    try {
        // 🛑 Check for required config
        if (!geminiApiKey || !geminiApiUrl) {
            throw new ApiError(400, "Missing Gemini API key or URL");
        }

        // Create cache key including structured output config
        const cacheKey = `${prompt}_${JSON.stringify(options)}`;

        // ✅ Cache hit
        if (descriptionCache.has(cacheKey)) {
            return descriptionCache.get(cacheKey);
        }

        // ⚠️ Rate limiting: max 5 requests every 60s
        const now = Date.now();
        requestTimestamps = requestTimestamps.filter(ts => now - ts < 60000);
        if (requestTimestamps.length >= 5) {
            throw new ApiError(429, "Rate limit exceeded. Try again later.");
        }
        requestTimestamps.push(now);

        // 🧠 Build request payload with structured output support
        const requestPayload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        };

        // Add generation config for structured output if provided
        if (options.responseSchema) {
            requestPayload.generationConfig = {
                responseMimeType: "application/json",
                responseSchema: options.responseSchema,
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.maxOutputTokens || 8192
            };
        }

        console.log("Sending request to Gemini with config:", {
            hasSchema: !!options.responseSchema,
            temperature: requestPayload.generationConfig?.temperature,
            maxTokens: requestPayload.generationConfig?.maxOutputTokens
        });

        const response = await axios.post(
            `${geminiApiUrl}?key=${geminiApiKey}`,
            requestPayload,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // 60 second timeout
            }
        );

        const text = response?.data?.candidates?.[0]?.content?.parts?.map(p => p.text).join(' ');

        if (!text) {
            console.error("Gemini API Response:", response?.data);
            throw new ApiError(500, "No valid response from Gemini");
        }

        console.log("Gemini response length:", text.length);

        // ✅ Store in cache
        descriptionCache.set(cacheKey, text);

        return text;

    } catch (error) {
        console.error("Gemini client error:", error?.response?.data || error?.message);
        
        // Handle specific API errors
        if (error.response?.status === 400) {
            throw new ApiError(400, `Gemini API error: ${error.response?.data?.error?.message || 'Invalid request'}`);
        }
        if (error.response?.status === 429) {
            throw new ApiError(429, "Gemini API rate limit exceeded");
        }
        if (error.response?.status === 403) {
            throw new ApiError(403, "Gemini API authentication failed");
        }
        
        throw new ApiError(500, "Failed to generate content from Gemini");
    }
};