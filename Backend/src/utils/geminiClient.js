import axios from 'axios'
import { ApiError } from './apiError.js'

const geminiApiUrl = process.env.GEMINI_API_URL
const geminiApiKey = process.env.GEMINI_API_KEY

// In-memory cache
const descriptionCache = new Map()

// Rate limiter store
let requestTimestamps = []

export const geminiClient = async (prompt) => {
    try {
        // 🛑 Check for required config
        if (!geminiApiKey || !geminiApiUrl) {
            throw new ApiError(400, "Missing Gemini API key or URL")
        }

        // ✅ Cache hit
        if (descriptionCache.has(prompt)) {
            return descriptionCache.get(prompt)
        }

        // ⚠️ Rate limiting: max 5 requests every 60s
        const now = Date.now()
        requestTimestamps = requestTimestamps.filter(ts => now - ts < 60000)
        if (requestTimestamps.length >= 5) {
            throw new ApiError(429, "Rate limit exceeded. Try again later.")
        }
        requestTimestamps.push(now)

        // 🧠 Correct Gemini API structure
        const response = await axios.post(
            `${geminiApiUrl}?key=${geminiApiKey}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        const text = response?.data?.candidates?.[0]?.content?.parts?.map(p => p.text).join(' ')

        if (!text) {
            throw new ApiError(500, "No valid response from Gemini")
        }

        // ✅ Store in cache (key = prompt)
        descriptionCache.set(prompt, text)

        return text

    } catch (error) {
        console.error("Gemini client error", error?.response?.data || error?.message)
        throw new ApiError(500, "Failed to generate content from Gemini")
    }
}
