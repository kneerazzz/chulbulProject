import { geminiClient } from "./geminiClient.js";
import { ApiError } from "./apiError.js";

/**
 * Robust JSON extraction from AI responses
 * Handles various response formats that AI models might return
 */
const extractJSON = (rawResponse) => {
  // Remove leading/trailing whitespace
  let cleaned = rawResponse.trim();
  
  // Remove code block wrappers (```json, ```, etc.)
  if (cleaned.startsWith("```")) {
    // Handle ```json\n{...}\n``` format
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    cleaned = cleaned.replace(/\n?```\s*$/, '');
  }
  
  // Remove any remaining backticks at start/end
  cleaned = cleaned.replace(/^`+|`+$/g, '');
  
  // Try to find JSON object boundaries
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }
  
  // Remove any text before the first { or after the last }
  cleaned = cleaned.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
  
  return cleaned.trim();
};

/**
 * Validate the structure of the parsed JSON response
 */
const validateResponse = (parsed) => {
  const requiredFields = ['topic', 'description', 'content'];
  const missing = requiredFields.filter(field => !parsed[field] || typeof parsed[field] !== 'string');
  
  if (missing.length > 0) {
    throw new ApiError(500, `AI response missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate content length (should be substantial)
  if (parsed.content.length < 500) {
    throw new ApiError(500, "AI response content too short. Expected comprehensive content.");
  }
  
  return true;
};

/**
 * Enhanced retry mechanism with exponential backoff
 */
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

const generateTopicContent = async ({
  skillName,
  targetLevel = "beginner",
  category,
  duration,
  currentDay,
  completedSubtopics = []
}) => {
  try {
    const completedList = completedSubtopics.length
      ? `They have already completed the following topics:\n- ${completedSubtopics.map(sub => `${sub.title} (on ${new Date(sub.completedAt).toLocaleDateString()})`).join("\n- ")}`
      : `This is their first day, no topics completed yet.`;

    const progressPercentage = Math.round((currentDay / duration) * 100);
    const remainingDays = duration - currentDay;

    const prompt = `
You are a world-class educator and curriculum designer creating a comprehensive learning module for ${skillName} (category: ${category}).

LEARNER PROFILE:
- Skill Level: ${targetLevel}
- Total Learning Duration: ${duration} days
- Current Progress: Day ${currentDay} of ${duration} (${progressPercentage}% complete)
- Remaining Days: ${remainingDays}
- ${completedList}

MISSION: Create today's lesson with substantially more comprehensive content than a typical tutorial. This should be a deep, engaging 15-20 minute learning experience.

CONTENT REQUIREMENTS:
Generate rich, detailed educational content (1000-1500 words) using **PROPER MARKDOWN FORMATTING**:

**Structure your content as:**

## 1. Hook & Context (150-200 words)
Start with an engaging introduction that explains why this topic is crucial for mastering ${skillName}. Use real-world scenarios or compelling examples.

## 2. Core Concepts Deep Dive (400-500 words)
Provide comprehensive explanations of the main ideas:
- Break down complex concepts into digestible parts
- Use specific examples, analogies, and comparisons
- Include bullet points for key principles
- Add concrete code examples, case studies, or practical scenarios
- Explain the "why" behind concepts, not just the "what"

Use proper markdown formatting:
- **Bold text** for important concepts
- *Italic text* for emphasis
- \`Code snippets \` for technical terms
- > Blockquotes for important notes
- Tables for comparisons when relevant

## 3. Practical Implementation (300-400 words)
Show exactly how to apply these concepts:
- Step-by-step processes or methodologies
- Common use cases and real-world applications
- Best practices from industry professionals
- Specific tools, techniques, or frameworks
- Troubleshooting tips for common issues

### Code Examples (when applicable):
\`\`\`javascript
// Provide concrete code examples with proper syntax highlighting
\`\`\`

## 4. Advanced Insights & Pro Tips (200-250 words)
Go beyond basics:
- Professional-level considerations
- Advanced techniques or optimizations
- Common pitfalls and how to avoid them
- How this topic connects to broader ${skillName} mastery
- Industry standards and emerging trends

## 5. Key Takeaways & Summary (100-150 words)
Tie everything together with key takeaways and preview future connections.

FORMATTING REQUIREMENTS:
- Use proper markdown headers (##, ###, ####)
- Use bullet points (-) and numbered lists (1.)
- Include **bold** and *italic* formatting
- Add \`code snippets\` for technical terms
- Use > blockquotes for important notes
- Include horizontal rules (---) to separate major sections
- Format code blocks with proper syntax highlighting
- Use tables when comparing features or concepts

QUALITY STANDARDS:
- Write in an engaging, conversational tone that keeps learners interested
- Use specific, concrete examples rather than abstract explanations
- Make content immediately actionable and practical
- Ensure depth appropriate for ${targetLevel} level
- Add variety with analogies, comparisons, and real-world connections

CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. Do not include any explanations, markdown formatting, or code block wrappers around the JSON. Start your response directly with { and end with }.

RESPONSE FORMAT (JSON only):
{
  "topic": "Clear, specific topic title",
  "description": "Compelling 2-3 sentence overview that hooks the learner",
  "content": "Your comprehensive 1000-1500 word educational content in PROPER MARKDOWN FORMAT following the structure above. Make it engaging, detailed, and packed with practical value.",
  "optionalTip": "A valuable pro tip, exercise, or actionable advice"
}
    `.trim();

    // Use retry mechanism for better reliability
    const result = await retryWithBackoff(async () => {
      console.log(`Generating content for ${skillName} - Day ${currentDay}...`);
      
      const rawResponse = await geminiClient(prompt);
      
      if (!rawResponse || typeof rawResponse !== 'string') {
        throw new ApiError(500, "Empty or invalid response from AI service");
      }
      
      console.log("Raw AI Response Preview:", rawResponse.substring(0, 200) + "...");
      
      // Enhanced JSON extraction
      const cleanedResponse = extractJSON(rawResponse);
      
      if (!cleanedResponse) {
        throw new ApiError(500, "Could not extract JSON from AI response");
      }
      
      let parsed;
      try {
        parsed = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message);
        console.error("Cleaned Response:", cleanedResponse.substring(0, 500) + "...");
        throw new ApiError(500, `Invalid JSON format in AI response: ${parseError.message}`);
      }
      
      // Validate the response structure
      validateResponse(parsed);
      
      return parsed;
    });

    const { topic, description, optionalTip, content } = result;

    // Additional content validation
    if (!content.includes('#') || content.length < 800) {
      console.warn("Content may not meet quality standards - regenerating...");
      throw new ApiError(500, "Generated content does not meet quality requirements");
    }

    return {
      topic: topic.trim(),
      description: description.trim(),
      content: content.trim(),
      optionalTip: optionalTip?.trim() || null,
    };

  } catch (error) {
    console.error("AI content generation failed:", error);
    
    // Enhanced error handling with more context
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network or API errors
    if (error.message?.includes('network') || error.message?.includes('timeout')) {
      throw new ApiError(503, "AI service temporarily unavailable. Please try again.");
    }
    
    // Generic fallback
    throw new ApiError(500, `Failed to generate topic content: ${error.message}`);
  }
};

export default generateTopicContent;