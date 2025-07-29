import { geminiClient } from "./geminiClient.js";
import { ApiError } from "./apiError.js";

const generateTopicContent = async ({ skillName, targetLevel = "beginner", category, duration, currentDay, completedTopics = [] }) => {
  try {
    const completedList = completedTopics.length
      ? `They have already completed the following topics:\n- ${completedTopics.join("\n- ")}`
      : `This is their first day, no topics completed yet.`;

    const prompt = `
      You're an expert teacher helping someone learn ${skillName} (category: ${category}) at a ${targetLevel} level.

      The learner wants to complete the skill in ${duration} days. Today is Day ${currentDay}.

      ${completedList}

      Suggest a new and unique topic for today's lesson that hasn't been covered yet.

      Respond ONLY with raw JSON. DO NOT wrap it in triple backticks or markdown. No explanations, no formatting — just return the raw JSON object.

      {
        "topic": "Your topic title",
        "description": "Short 1-2 sentence explanation of the topic",
        "content": "A 10 min reading paragraphs(3-4) on the topic covering the core concepts or important concepts",
        "optionalTip": "A useful tip or exercise for practice"
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
