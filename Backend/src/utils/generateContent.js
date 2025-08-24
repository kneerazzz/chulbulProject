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
    .max(2000, "Description must be less than 2000 characters")
    .refine(val => val.trim().length > 0, "Description cannot be empty or whitespace"),
  
  content: z.string()
    .min(800, "Content must be at least 800 characters for comprehensive learning")
    .max(10000, "Content should not exceed 10000 characters")
    .refine(val => val.includes('#'), "Content must include markdown headers")
    .refine(val => val.includes('##'), "Content must have proper section structure")
    .refine(val => val.trim().length > 0, "Content cannot be empty or whitespace"),
  
  optionalTip: z.string()
    .min(10, "Optional tip should be at least 10 characters if provided")
    .max(2000, "Optional tip should be less than 2000 characters")
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
 * COMPLETELY REWRITTEN JSON extraction - fixes the double-escaping issue
 */
const extractJSON = (rawResponse) => {
  let cleaned = rawResponse.trim();
  
  console.log("🔧 Starting JSON extraction...");
  console.log("📋 Original length:", cleaned.length);
  console.log("📋 First 100 chars:", cleaned.substring(0, 100));
  
  // Step 1: Remove code block wrappers
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    cleaned = cleaned.replace(/\n?```\s*$/, '');
    console.log("✂️  Removed code blocks");
  }
  
  // Step 2: Remove backticks
  cleaned = cleaned.replace(/^`+|`+$/g, '');
  
  // Step 3: Find JSON boundaries
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    console.error("❌ No valid JSON boundaries found");
    return null;
  }
  
  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  console.log("✂️  Extracted JSON boundaries");
  console.log("📋 After boundaries:", cleaned.substring(0, 100));
  
  // Step 4: Fix the MAIN ISSUE - Handle escaped characters properly
  try {
    // Try to parse as-is first (sometimes it's already valid)
    JSON.parse(cleaned);
    console.log("✅ JSON is already valid!");
    return cleaned;
  } catch (e) {
    console.log("🔧 JSON needs fixing, applying corrections...");
  }
  
  // Step 5: Fix common issues WITHOUT breaking valid escaping
  cleaned = cleaned
    .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
    .replace(/\\n/g, '\n')          // Fix double-escaped newlines  
    .replace(/\\r/g, '\r')          // Fix double-escaped returns
    .replace(/\\t/g, '\t')          // Fix double-escaped tabs
    .replace(/\\\\/g, '\\');        // Fix double-escaped backslashes
  
  console.log("🔧 Applied basic fixes");
  console.log("📋 After fixes:", cleaned.substring(0, 100));
  
  // Step 6: Try parsing again
  try {
    JSON.parse(cleaned);
    console.log("✅ JSON fixed and valid!");
    return cleaned;
  } catch (e) {
    console.log("⚠️  Still invalid, trying aggressive fix...");
  }
  
  // Step 7: Last resort - re-escape everything properly
  try {
    // Parse the malformed JSON by treating it as a raw string and reconstructing
    const lines = cleaned.split('\n');
    let inString = false;
    let result = '';
    
    for (let line of lines) {
      // Count unescaped quotes to track if we're inside a string
      let escapedQuotes = 0;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"' && (i === 0 || line[i-1] !== '\\')) {
          escapedQuotes++;
        }
      }
      
      if (escapedQuotes % 2 === 1) {
        inString = !inString;
      }
      
      // If we're inside a string value, preserve the line break
      if (inString && result.length > 0) {
        result += '\\n';
      } else if (result.length > 0) {
        result += '\n';
      }
      
      result += line;
    }
    
    console.log("🔧 Applied aggressive reconstruction");
    return result;
    
  } catch (e) {
    console.error("❌ All JSON fixes failed:", e.message);
    return null;
  }
};

/**
 * Alternative extraction method using regex
 */
const extractWithRegex = (rawResponse) => {
  console.log("🔧 Using regex extraction method...");
  
  // Find JSON using regex pattern
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return null;
  }
  
  let extracted = jsonMatch[0];
  
  // Clean up the extracted JSON
  extracted = extracted
    .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
    .replace(/\\n/g, '\n')          // Fix newlines
    .replace(/\\r/g, '\r')          // Fix carriage returns
    .replace(/\\t/g, '\t');         // Fix tabs
  
  return extracted;
};

/**
 * Manual parsing as last resort - builds valid JSON from scratch
 */
const extractWithManualParsing = (rawResponse) => {
  console.log("🔧 Using manual parsing method...");
  
  try {
    // Find the content between first { and last }
    const start = rawResponse.indexOf('{');
    const end = rawResponse.lastIndexOf('}');
    
    if (start === -1 || end === -1) return null;
    
    const content = rawResponse.substring(start + 1, end);
    
    // Extract fields manually using patterns
    const topicMatch = content.match(/"topic"\s*:\s*"([^"]+)"/);
    const descMatch = content.match(/"description"\s*:\s*"([^"]+)"/);
    const tipMatch = content.match(/"optionalTip"\s*:\s*"([^"]+)"/);
    
    // Extract content field (more complex due to multiline)
    const contentStart = content.indexOf('"content"');
    if (contentStart === -1) return null;
    
    const contentValueStart = content.indexOf('"', contentStart + 9); // Skip "content":
    if (contentValueStart === -1) return null;
    
    let contentValue = '';
    let pos = contentValueStart + 1;
    let inEscape = false;
    
    while (pos < content.length) {
      const char = content[pos];
      
      if (inEscape) {
        contentValue += char;
        inEscape = false;
      } else if (char === '\\') {
        contentValue += char;
        inEscape = true;
      } else if (char === '"') {
        // End of content value
        break;
      } else {
        contentValue += char;
      }
      pos++;
    }
    
    // Build valid JSON object
    const result = {
      topic: topicMatch ? topicMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
      content: contentValue,
      optionalTip: tipMatch ? tipMatch[1] : null
    };
    
    return JSON.stringify(result);
    
  } catch (error) {
    console.error("Manual parsing failed:", error.message);
    return null;
  }
};
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

    // Use retry mechanism with multiple strategies
    const result = await retryWithBackoff(async () => {
      console.log(`🚀 Generating content for ${skillName} - Day ${currentDay}...`);
      
      // Strategy 1: Try structured output first (if your Gemini client supports it)
      try {
        console.log("🎯 Attempting structured output...");
        const structuredResponse = await geminiClient(prompt, {
          responseSchema: jsonSchema,
          temperature: 0.7,
          maxOutputTokens: 8192
        });
        
        // If structured output worked, it should be valid JSON
        const parsed = JSON.parse(structuredResponse);
        const validation = validateWithZod(parsed);
        
        if (validation.isValid) {
          console.log("✅ Structured output successful!");
          return validation.data;
        }
      } catch (structuredError) {
        console.log("⚠️  Structured output failed, trying manual parsing...");
      }
      
      // Strategy 2: Manual JSON parsing with enhanced cleaning
      const rawResponse = await geminiClient(prompt);
      
      if (!rawResponse || typeof rawResponse !== 'string') {
        throw new ApiError(500, "Empty or invalid response from AI service");
      }
      
      console.log("📝 Raw AI Response Preview:", rawResponse.substring(0, 200) + "...");
      
      // Try multiple extraction methods
      let parsed = null;
      const extractionMethods = [
        () => extractJSON(rawResponse),
        () => extractWithRegex(rawResponse),
        () => extractWithManualParsing(rawResponse)
      ];
      
      for (const [index, method] of extractionMethods.entries()) {
        try {
          console.log(`🔧 Trying extraction method ${index + 1}...`);
          const cleanedResponse = method();
          
          if (!cleanedResponse) {
            console.log(`❌ Method ${index + 1} failed to extract JSON`);
            continue;
          }
          
          parsed = JSON.parse(cleanedResponse);
          console.log(`✅ Method ${index + 1} successful!`);
          break;
          
        } catch (error) {
          console.log(`❌ Method ${index + 1} failed:`, error.message);
          continue;
        }
      }
      
      if (!parsed) {
        throw new ApiError(500, "All JSON extraction methods failed");
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