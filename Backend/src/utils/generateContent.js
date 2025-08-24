import { geminiClient } from "./geminiClient.js";
import { ApiError } from "./apiError.js";
import { z } from "zod";

// Define comprehensive Zod schema for content validation
const ContentResponseSchema = z.object({
  topic: z.string()
    .min(5, "Topic must be at least 5 characters")
    .max(100, "Topic must be less than 100 characters")
    .refine(val => val.trim().length > 0, "Topic cannot be empty or whitespace"),
  
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(300, "Description must be less than 300 characters")
    .refine(val => val.trim().length > 0, "Description cannot be empty or whitespace"),
  
  content: z.string()
    .min(800, "Content must be at least 800 characters for comprehensive learning")
    .max(5000, "Content should not exceed 5000 characters")
    .refine(val => val.includes('#'), "Content must include markdown headers")
    .refine(val => val.includes('##'), "Content must have proper section structure")
    .refine(val => val.trim().length > 0, "Content cannot be empty or whitespace"),
  
  optionalTip: z.string()
    .min(10, "Optional tip should be at least 10 characters if provided")
    .max(500, "Optional tip should be less than 500 characters")
    .optional()
    .or(z.null())
});

// Create JSON schema for AI prompt (derived from Zod schema)
const getJSONSchema = () => ({
  type: "object",
  properties: {
    topic: {
      type: "string",
      description: "Clear, specific topic title (5-100 characters)",
      minLength: 5,
      maxLength: 100
    },
    description: {
      type: "string", 
      description: "Compelling 2-3 sentence overview that hooks the learner (20-300 characters)",
      minLength: 20,
      maxLength: 300
    },
    content: {
      type: "string",
      description: "Comprehensive educational content in proper markdown format (minimum 800 characters)",
      minLength: 800,
      maxLength: 5000
    },
    optionalTip: {
      type: "string",
      description: "A valuable pro tip, exercise, or actionable advice (10-500 characters)"
    }
  },
  required: ["topic", "description", "content"],
  additionalProperties: false
});

/**
 * Enhanced JSON extraction with better error handling
 */
const extractJSON = (rawResponse) => {
  let cleaned = rawResponse.trim();
  
  // Remove code block wrappers
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    cleaned = cleaned.replace(/\n?```\s*$/, '');
  }
  
  // Remove backticks
  cleaned = cleaned.replace(/^`+|`+$/g, '');
  
  // Find JSON boundaries
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }
  
  // Clean up extra text
  cleaned = cleaned.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
  
  // Fix common JSON issues
  cleaned = cleaned
    .replace(/,\s*}/g, '}')     // Remove trailing commas in objects
    .replace(/,\s*]/g, ']')     // Remove trailing commas in arrays
    .replace(/\n/g, '\\n')      // Escape newlines
    .replace(/\r/g, '\\r')      // Escape carriage returns  
    .replace(/\t/g, '\\t')      // Escape tabs
    .replace(/\\/g, '\\\\')     // Escape backslashes (but not if already escaped)
    .replace(/"/g, '\\"')       // Escape quotes (this might be too aggressive)
    .replace(/\\"/g, '"');      // Fix over-escaped quotes
  
  return cleaned.trim();
};

/**
 * Zod-powered validation with detailed error messages
 */
const validateWithZod = (data) => {
  try {
    // Parse and validate with Zod
    const validatedData = ContentResponseSchema.parse(data);
    
    console.log("✅ Zod validation passed");
    
    return {
      isValid: true,
      data: validatedData,
      errors: null
    };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      
      console.error("❌ Zod validation failed:", errorMessages);
      
      return {
        isValid: false,
        data: null,
        errors: errorMessages
      };
    }
    
    // Handle non-Zod errors
    console.error("❌ Unexpected validation error:", error);
    return {
      isValid: false,
      data: null,
      errors: [`Unexpected validation error: ${error.message}`]
    };
  }
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
      
      // Don't retry on validation errors (they won't fix themselves)
      if (error.statusCode === 400 || error.message?.includes('validation')) {
        console.warn("Validation error - not retrying");
        throw error;
      }
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Main content generation function with Zod validation
 */
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
    const jsonSchema = getJSONSchema();

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

CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object matching this exact schema:
${JSON.stringify(jsonSchema, null, 2)}

Start your response directly with { and end with }. No explanations, no markdown wrappers.

RESPONSE FORMAT (JSON only):
{
  "topic": "Clear, specific topic title (5-100 chars)",
  "description": "Compelling 2-3 sentence overview (20-300 chars)",
  "content": "Your comprehensive educational content in PROPER MARKDOWN FORMAT (800+ chars)",
  "optionalTip": "A valuable pro tip or actionable advice (optional, 10-500 chars)"
}
    `.trim();

    // Use retry mechanism with Zod validation
    const result = await retryWithBackoff(async () => {
      console.log(`🚀 Generating content for ${skillName} - Day ${currentDay}...`);
      
      const rawResponse = await geminiClient(prompt);
      
      if (!rawResponse || typeof rawResponse !== 'string') {
        throw new ApiError(500, "Empty or invalid response from AI service");
      }
      
      console.log("📝 Raw AI Response Preview:", rawResponse.substring(0, 200) + "...");
      
      // Enhanced JSON extraction
      const cleanedResponse = extractJSON(rawResponse);
      
      if (!cleanedResponse) {
        throw new ApiError(500, "Could not extract JSON from AI response");
      }
      
      let parsed;
      try {
        parsed = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError.message);
        console.error("🔍 Cleaned Response Sample:", cleanedResponse.substring(0, 500) + "...");
        throw new ApiError(500, `Invalid JSON format in AI response: ${parseError.message}`);
      }
      
      // Zod validation with detailed feedback
      const validation = validateWithZod(parsed);
      
      if (!validation.isValid) {
        const errorSummary = validation.errors.join('; ');
        console.error("❌ Content validation failed:", errorSummary);
        throw new ApiError(500, `Generated content failed validation: ${errorSummary}`);
      }
      
      console.log("✅ All validations passed successfully");
      return validation.data;
    });

    const { topic, description, optionalTip, content } = result;

    // Additional quality checks (beyond Zod schema)
    const qualityIssues = [];
    
    if (!content.includes('##')) {
      qualityIssues.push("Missing proper section headers");
    }
    
    if (!content.includes('```')) {
      qualityIssues.push("Missing code examples (if applicable)");
    }
    
    if (content.split(' ').length < 200) {
      qualityIssues.push("Content seems too brief for comprehensive learning");
    }
    
    if (qualityIssues.length > 0) {
      console.warn("⚠️ Quality concerns detected:", qualityIssues.join(', '));
      // Don't throw error, just warn
    }

    console.log("🎉 Content generation completed successfully");

    return {
      topic: topic.trim(),
      description: description.trim(),
      content: content.trim(),
      optionalTip: optionalTip?.trim() || null,
      // Include validation metadata for debugging
      _metadata: {
        contentLength: content.length,
        wordCount: content.split(' ').length,
        hasHeaders: content.includes('##'),
        hasCodeBlocks: content.includes('```'),
        validationPassed: true
      }
    };

  } catch (error) {
    console.error("❌ AI content generation failed:", error);
    
    // Enhanced error handling with more context
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      const zodErrors = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ');
      throw new ApiError(400, `Content validation failed: ${zodErrors}`);
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