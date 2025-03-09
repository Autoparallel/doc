import Anthropic from '@anthropic-ai/sdk';

// We don't initialize the client globally anymore - only in the server function
// This prevents client-side errors when accessing env variables

// Simple cache to prevent duplicate API calls
const responseCache = new Map();

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
 * Process health data using Claude to generate personalized recipes
 * This is a server-side only function
 */
export async function processHealthData(data: HealthData): Promise<Recipe[]> {
    try {
        // Generate a cache key based on the input data
        const cacheKey = JSON.stringify(data);

        // Check if we have a cached response
        if (responseCache.has(cacheKey)) {
            console.log("Using cached recipe results - preventing duplicate API calls");
            return responseCache.get(cacheKey);
        }

        // Only initialize the client inside the server function
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

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

Format your response as a valid JSON array of recipe objects. Each recipe object should follow this structure:
{
  "title": "Recipe Title",
  "description": "Description of the recipe and its benefits",
  "image": "https://images.unsplash.com/photo-placeholder",
  "prepTime": "X mins",
  "cookTime": "X mins",
  "calories": X,
  "protein": "Xg",
  "carbs": "Xg",
  "fats": "Xg",
  "tags": ["tag1", "tag2"],
  "benefits": ["benefit1", "benefit2"],
  "ingredients": ["ingredient1", "ingredient2"],
  "instructions": ["step1", "step2"]
}`;

        try {
            // Call Claude API
            const message = await anthropic.messages.create({
                model: "claude-3-7-sonnet-20250219",
                max_tokens: 4000,
                system: "You are a nutritionist and chef specialized in creating personalized recipes based on health data. Your recipes should be tasty, practical, and targeted to address specific health conditions or goals. Always format your responses as valid JSON when requested.",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
            });

            // Parse the response
            const content = message.content[0]?.type === 'text' ? message.content[0].text : '';
            if (!content) {
                throw new Error("No response from Claude");
            }

            // Extract JSON from the response
            // Claude might wrap the JSON in markdown code blocks, so we need to handle that
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                content.match(/```\n([\s\S]*?)\n```/) ||
                [null, content];

            const jsonContent = jsonMatch[1] ? jsonMatch[1] : content;

            try {
                const parsedResponse = JSON.parse(jsonContent);
                const recipes = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.recipes || [];

                // Add IDs to the recipes for UI purposes and ensure valid image URLs
                const processedRecipes = recipes.map((recipe: Partial<Recipe>, index: number) => {
                    // Helper function to ensure field is array
                    const ensureArray = (field: string[] | string | undefined): string[] => {
                        if (!field) return [];
                        if (Array.isArray(field)) return field;
                        if (typeof field === 'string') {
                            // Handle possible comma-separated strings
                            if (field.includes(',')) {
                                return field.split(',').map(item => item.trim()).filter(Boolean);
                            }
                            return [field];
                        }
                        return [];
                    };

                    return {
                        ...recipe,
                        id: index + 1,
                        // Format array fields properly
                        tags: ensureArray(recipe.tags),
                        benefits: ensureArray(recipe.benefits),
                        ingredients: ensureArray(recipe.ingredients),
                        instructions: ensureArray(recipe.instructions),
                        // Use a real image URL (not placeholder_url) for Next.js Image component
                        image: recipe.image && recipe.image !== "placeholder_url"
                            ? recipe.image
                            : `https://images.unsplash.com/photo-${1550000000000 + index}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`
                    };
                });

                // Cache the results to prevent duplicate API calls
                responseCache.set(cacheKey, processedRecipes);

                return processedRecipes;
            } catch (err) {
                console.error("Error parsing JSON from Claude response:", err);
                console.log("Raw response:", content);
                throw new Error("Failed to parse recipes from Claude response");
            }
        } catch (apiError: unknown) {
            console.error("Claude API error:", apiError);
            const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
            throw new Error(`Claude API error: ${errorMessage}`);
        }

    } catch (error) {
        console.error("Error processing health data:", error);
        throw error;
    }
} 