import OpenAI from 'openai';

// Initialize the OpenAI client
// In a production app, this would be a server-side only operation
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Get API key from environment variable
});

export interface HealthData {
    files?: {
        lab?: File | null;
        fitness?: File | null;
        medical?: File | null;
        diet?: File | null;
    };
    personalInfo?: {
        age?: string;
        sex?: string;
        height?: string;
        weight?: string;
        allergies?: string;
        dietaryPreferences?: string;
    };
}

export interface Recipe {
    id?: number;  // Added for UI purposes
    title: string;
    description: string;
    image: string;  // In a real app, this might be a URL to an image generated or selected by the AI
    prepTime: string;
    cookTime: string;
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
    tags: string[];
    benefits: string[];
    ingredients: string[];
    instructions: string[];
}

/**
 * Process health data using OpenAI to generate personalized recipes
 */
export async function processHealthData(data: HealthData): Promise<Recipe[]> {
    try {
        // In a real application, we would extract text from uploaded files
        // For now, we'll just use the personal information

        let prompt = `Generate 3 personalized recipes based on the following health information:`;

        // Add personal information to the prompt if available
        if (data.personalInfo) {
            const info = data.personalInfo;

            if (info.age) prompt += `\nAge: ${info.age}`;
            if (info.sex) prompt += `\nSex: ${info.sex}`;
            if (info.height) prompt += `\nHeight: ${info.height} cm`;
            if (info.weight) prompt += `\nWeight: ${info.weight} kg`;
            if (info.allergies) prompt += `\nAllergies/Intolerances: ${info.allergies}`;
            if (info.dietaryPreferences) prompt += `\nDietary Preferences: ${info.dietaryPreferences}`;
        }

        prompt += `\n\nFor each recipe, provide:
1. Title
2. Description
3. Preparation time
4. Cooking time
5. Nutritional information (calories, protein, carbs, fats)
6. Tags (e.g., heart-healthy, high-protein, etc.)
7. Health benefits
8. Ingredients list
9. Step-by-step instructions

Format your response as a valid JSON array.`;

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Use appropriate model
            messages: [
                {
                    role: "system",
                    content: "You are a nutritionist and chef specialized in creating personalized recipes based on health data. Your recipes should be tasty, practical, and targeted to address specific health conditions or goals."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
        });

        // Parse the response
        const content = response.choices[0]?.message.content;
        if (!content) {
            throw new Error("No response from OpenAI");
        }

        const parsedResponse = JSON.parse(content);
        return parsedResponse.recipes || [];

    } catch (error) {
        console.error("Error processing health data:", error);
        throw error;
    }
} 