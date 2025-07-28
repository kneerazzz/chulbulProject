import { geminiClient } from "./geminiClient.js";


import { ApiError } from "./apiError.js";

const generateTopicContent = async({skillName, targetLevel = "beginner", category, duration, currentDay, completedTopics=[]}) => {
    try{
          const completedList = completedTopics.length
            ? `They have already completed the following topics:\n- ${completedTopics.join("\n- ")}`
            : `This is their first day, no topics completed yet.`

          const prompt = `
            You are an expert educator helping a student learn "${skillName}" in the "${category}" category at a ${targetLevel} level.

            They aim to master this in ${duration} days. Today is Day ${currentDay}.

            ${completedList}

            Suggest a **new** topic for today that has NOT been covered earlier.

            **Include**:
            - Topic (short and clear)
            - Description (1–2 short paragraphs max)
            - Optional Tip (examples, micro-exercise, or analogy)

            Format strictly as:
            - Topic: ...
            - Description: ...
            - Optional Tip: ...
            `.trim();


        const topicContent = await geminiClient(prompt);

        return topicContent;
    }catch(error){
        console.log("AI description generation failed", error)
        throw new ApiError(500, "Failed to generate skill description")
    }
}

export default generateTopicContent;