import { geminiClient } from "./geminiClient.js";
import { ApiError } from "./apiError.js";

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

RESPONSE FORMAT:
Return ONLY raw JSON (no markdown, no code blocks, no explanations):

{
  "topic": "Clear, specific topic title",
  "description": "Compelling 2-3 sentence overview that hooks the learner",
  "content": "Your comprehensive 1000-1500 word educational content in PROPER MARKDOWN FORMAT following the structure above. Make it engaging, detailed, and packed with practical value.",
  "optionalTip": "A valuable pro tip, exercise, or actionable advice"
}
    `.trim();

    let rawResponse = await geminiClient(prompt);

    // ✅ STRIP CODE BLOCK WRAPPERS
    rawResponse = rawResponse.trim();
    if (rawResponse.startsWith("```json") || rawResponse.startsWith("```")) {
      rawResponse = rawResponse.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", rawResponse);
      throw new ApiError(500, "Invalid AI response format. Expected JSON.");
    }

    const { topic, description, optionalTip, content } = parsed;

    if (!topic || !description || !content) {
      throw new ApiError(500, "AI response is missing required fields.");
    }

    return {
      topic: topic.trim(),
      description: description.trim(),
      content: content.trim(),
      optionalTip: optionalTip?.trim() || null,
    };

  } catch (error) {
    console.error("AI content generation failed:", error);
    throw new ApiError(500, "Failed to generate topic content");
  }
};

export default generateTopicContent;