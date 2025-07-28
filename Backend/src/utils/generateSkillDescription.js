import { geminiClient } from "./geminiClient.js";

import { ApiError } from "./apiError.js";


const generateSkillDescription = async(title, level = "beginner") => {
    try {
        const prompt = `Give a concise, 2-sentence description of the skill "${title}" for a ${level} learner. Make it clear, motivating, and informative.`
        const aiResponse = await geminiClient(prompt)

        if(!aiResponse){
            throw new ApiError("No response from gemini")
        }
        return aiResponse.trim();
        
    } catch (error) {
        console.log("Ai description generation failed", error)
        throw new ApiError(500, "Failed to generate skill description")
        
    }
}


export default generateSkillDescription;