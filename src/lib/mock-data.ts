import { Recipe } from "./openai";

// Mock recipe data to use as a fallback if the API fails
export const mockRecipes: Recipe[] = [
    {
        id: 1,
        title: "Omega-3 Rich Salmon Bowl",
        description: "A nutrient-dense bowl with grilled salmon, quinoa, and vegetables, perfect for improving your cholesterol levels and heart health.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: "20 mins",
        cookTime: "15 mins",
        calories: 420,
        protein: "32g",
        carbs: "45g",
        fats: "15g",
        tags: ["heart-healthy", "high-protein", "low-inflammatory"],
        benefits: ["Supports heart health", "Improves HDL cholesterol", "Anti-inflammatory"],
        ingredients: [
            "6 oz wild-caught salmon fillet",
            "1/2 cup cooked quinoa",
            "1 cup mixed greens",
            "1/4 avocado, sliced",
            "1/4 cup cucumber, diced",
            "1/4 cup cherry tomatoes, halved",
            "1 tbsp olive oil",
            "1 tsp lemon juice",
            "Salt and pepper to taste",
        ],
        instructions: [
            "Season salmon with salt and pepper.",
            "Grill or bake salmon for 12-15 minutes until cooked through.",
            "In a bowl, arrange the quinoa, mixed greens, avocado, cucumber, and tomatoes.",
            "Top with the cooked salmon.",
            "Drizzle with olive oil and lemon juice.",
            "Season with additional salt and pepper if desired.",
        ],
    },
    {
        id: 2,
        title: "Antioxidant-Rich Berry Smoothie",
        description: "A powerful smoothie packed with berries, spinach, and seeds to boost your antioxidant levels and support immune function.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a90a0369?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: "5 mins",
        cookTime: "0 mins",
        calories: 280,
        protein: "12g",
        carbs: "38g",
        fats: "10g",
        tags: ["immune-support", "antioxidant", "quick"],
        benefits: ["Boosts immune system", "Fights oxidative stress", "Improves skin health"],
        ingredients: [
            "1 cup mixed berries (blueberries, strawberries, blackberries)",
            "1 cup spinach",
            "1 tbsp flaxseeds",
            "1 tbsp chia seeds",
            "1 cup unsweetened almond milk",
            "1/2 scoop plant-based protein powder (optional)",
            "1/2 tsp vanilla extract",
            "Ice cubes as needed",
        ],
        instructions: [
            "Add all ingredients to a blender.",
            "Blend on high until smooth and creamy.",
            "Add more almond milk or ice if needed to achieve desired consistency.",
            "Pour into a glass and enjoy immediately.",
        ],
    },
    {
        id: 3,
        title: "Anti-Inflammatory Turmeric Lentil Soup",
        description: "A warming soup with turmeric, lentils, and vegetables to reduce inflammation and support digestive health.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: "15 mins",
        cookTime: "30 mins",
        calories: 310,
        protein: "18g",
        carbs: "52g",
        fats: "4g",
        tags: ["anti-inflammatory", "high-fiber", "digestive-health"],
        benefits: ["Reduces inflammation", "Supports gut health", "Boosts immunity"],
        ingredients: [
            "1 cup red lentils, rinsed",
            "1 tbsp olive oil",
            "1 onion, diced",
            "2 carrots, diced",
            "2 celery stalks, diced",
            "3 garlic cloves, minced",
            "1 tbsp fresh ginger, grated",
            "1 tsp ground turmeric",
            "1/2 tsp ground cumin",
            "1/4 tsp black pepper",
            "4 cups vegetable broth",
            "1 cup spinach, chopped",
            "Juice of 1/2 lemon",
            "Salt to taste",
        ],
        instructions: [
            "Heat olive oil in a large pot over medium heat.",
            "Add onion, carrots, and celery. Sauté for 5-7 minutes until softened.",
            "Add garlic, ginger, turmeric, cumin, and black pepper. Cook for 1 minute until fragrant.",
            "Add lentils and vegetable broth. Bring to a boil, then reduce heat and simmer for 25 minutes.",
            "Stir in spinach and lemon juice. Cook for 2-3 minutes until spinach is wilted.",
            "Season with salt to taste.",
            "Serve hot.",
        ],
    },
]; 