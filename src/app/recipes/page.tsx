'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Recipe } from '@/lib/openai';

// Mock recipe data as a fallback if the API fails
const mockRecipes = [
    {
        id: 1,
        title: 'Omega-3 Rich Salmon Bowl',
        description: 'A nutrient-dense bowl with grilled salmon, quinoa, and vegetables, perfect for improving your cholesterol levels and heart health.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        prepTime: '20 mins',
        cookTime: '15 mins',
        calories: 420,
        protein: '32g',
        carbs: '45g',
        fats: '15g',
        tags: ['heart-healthy', 'high-protein', 'low-inflammatory'],
        benefits: ['Supports heart health', 'Improves HDL cholesterol', 'Anti-inflammatory'],
        ingredients: [
            '6 oz wild-caught salmon fillet',
            '1/2 cup cooked quinoa',
            '1 cup mixed greens',
            '1/4 avocado, sliced',
            '1/4 cup cucumber, diced',
            '1/4 cup cherry tomatoes, halved',
            '1 tbsp olive oil',
            '1 tsp lemon juice',
            'Salt and pepper to taste',
        ],
        instructions: [
            'Season salmon with salt and pepper.',
            'Grill or bake salmon for 12-15 minutes until cooked through.',
            'In a bowl, arrange the quinoa, mixed greens, avocado, cucumber, and tomatoes.',
            'Top with the cooked salmon.',
            'Drizzle with olive oil and lemon juice.',
            'Season with additional salt and pepper if desired.',
        ],
    },
    {
        id: 2,
        title: 'Antioxidant-Rich Berry Smoothie',
        description: 'A powerful smoothie packed with berries, spinach, and seeds to boost your antioxidant levels and support immune function.',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a90a0369?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        prepTime: '5 mins',
        cookTime: '0 mins',
        calories: 280,
        protein: '12g',
        carbs: '38g',
        fats: '10g',
        tags: ['immune-support', 'antioxidant', 'quick'],
        benefits: ['Boosts immune system', 'Fights oxidative stress', 'Improves skin health'],
        ingredients: [
            '1 cup mixed berries (blueberries, strawberries, blackberries)',
            '1 cup spinach',
            '1 tbsp flaxseeds',
            '1 tbsp chia seeds',
            '1 cup unsweetened almond milk',
            '1/2 scoop plant-based protein powder (optional)',
            '1/2 tsp vanilla extract',
            'Ice cubes as needed',
        ],
        instructions: [
            'Add all ingredients to a blender.',
            'Blend on high until smooth and creamy.',
            'Add more almond milk or ice if needed to achieve desired consistency.',
            'Pour into a glass and enjoy immediately.',
        ],
    },
    {
        id: 3,
        title: 'Anti-Inflammatory Turmeric Lentil Soup',
        description: 'A warming soup with turmeric, lentils, and vegetables to reduce inflammation and support digestive health.',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        prepTime: '15 mins',
        cookTime: '30 mins',
        calories: 310,
        protein: '18g',
        carbs: '52g',
        fats: '4g',
        tags: ['anti-inflammatory', 'high-fiber', 'digestive-health'],
        benefits: ['Reduces inflammation', 'Supports gut health', 'Boosts immunity'],
        ingredients: [
            '1 cup red lentils, rinsed',
            '1 tbsp olive oil',
            '1 onion, diced',
            '2 carrots, diced',
            '2 celery stalks, diced',
            '3 garlic cloves, minced',
            '1 tbsp fresh ginger, grated',
            '1 tsp ground turmeric',
            '1/2 tsp ground cumin',
            '1/4 tsp black pepper',
            '4 cups vegetable broth',
            '1 cup spinach, chopped',
            'Juice of 1/2 lemon',
            'Salt to taste',
        ],
        instructions: [
            'Heat olive oil in a large pot over medium heat.',
            'Add onion, carrots, and celery. Sauté for 5-7 minutes until softened.',
            'Add garlic, ginger, turmeric, cumin, and black pepper. Cook for 1 minute until fragrant.',
            'Add lentils and vegetable broth. Bring to a boil, then reduce heat and simmer for 25 minutes.',
            'Stir in spinach and lemon juice. Cook for 2-3 minutes until spinach is wilted.',
            'Season with salt to taste.',
            'Serve hot.',
        ],
    },
];

export default function RecipesPage() {
    const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
    const [filter, setFilter] = useState('all');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    // Load recipes from session storage
    useEffect(() => {
        try {
            const storedRecipes = sessionStorage.getItem('recipes');
            if (storedRecipes) {
                const parsedRecipes = JSON.parse(storedRecipes);
                if (Array.isArray(parsedRecipes) && parsedRecipes.length > 0) {
                    // Add ids and default images to the recipes if needed
                    const recipesWithIds = parsedRecipes.map((recipe, index) => ({
                        ...recipe,
                        id: index + 1,
                        // Use a default image if none is provided
                        image: recipe.image || `https://images.unsplash.com/photo-${1550000000000 + index}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`
                    }));
                    setRecipes(recipesWithIds);
                    setLoading(false);
                    return;
                }
            }

            // If no recipes found in session storage or if parsing fails, use mock data
            setRecipes(mockRecipes);
        } catch (error) {
            console.error('Error loading recipes:', error);
            setRecipes(mockRecipes);
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredRecipes = filter === 'all'
        ? recipes
        : recipes.filter(recipe => recipe.tags.includes(filter));

    const recipe = selectedRecipe !== null
        ? recipes.find(r => r.id === selectedRecipe)
        : null;

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your personalized recipes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white dark:bg-gray-900 shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="font-bold text-xl text-blue-600">
                            Health Recipes
                        </Link>
                        <Link
                            href="/upload"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            Update Health Data
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-10 bg-gray-50 dark:bg-gray-900">
                {selectedRecipe === null ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Your Personalized Recipe Recommendations
                            </h1>
                            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                                Based on your health data, we&apos;ve created these custom recipes to help improve your health metrics.
                            </p>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Filter by health benefit:
                            </label>
                            <select
                                id="filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="mt-1 block w-full md:w-64 rounded-md border-gray-300 dark:border-gray-700 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 
                  dark:text-white sm:text-sm"
                            >
                                <option value="all">All Recipes</option>
                                <option value="heart-healthy">Heart Healthy</option>
                                <option value="high-protein">High Protein</option>
                                <option value="anti-inflammatory">Anti-Inflammatory</option>
                                <option value="immune-support">Immune Support</option>
                                <option value="high-fiber">High Fiber</option>
                                <option value="digestive-health">Digestive Health</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRecipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div
                                        className="h-48 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${recipe.image})` }}
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                            {recipe.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {recipe.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                >
                                                    {tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <div>Prep: {recipe.prepTime}</div>
                                            <div>Cook: {recipe.cookTime}</div>
                                            <div>{recipe.calories} cal</div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRecipe(recipe.id ?? null)}
                                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                        text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            View Recipe
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredRecipes.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400">
                                    No recipes found with the selected filter. Try a different filter.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSelectedRecipe(null)}
                            className="mb-6 flex items-center text-blue-600 hover:text-blue-500"
                        >
                            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to all recipes
                        </button>

                        {recipe && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                <div
                                    className="h-64 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${recipe.image})` }}
                                />

                                <div className="p-6">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {recipe.title}
                                    </h1>

                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        {recipe.description}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Prep Time</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{recipe.prepTime}</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Cook Time</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{recipe.cookTime}</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{recipe.calories}</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Protein</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{recipe.protein}</div>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            Health Benefits
                                        </h2>
                                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                            {recipe.benefits.map((benefit, index) => (
                                                <li key={index}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                                Ingredients
                                            </h2>
                                            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                                {recipe.ingredients.map((ingredient, index) => (
                                                    <li key={index}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                                Instructions
                                            </h2>
                                            <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
                                                {recipe.instructions.map((instruction, index) => (
                                                    <li key={index}>{instruction}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            This recipe was specially selected based on your health data. The ingredients and
                                            preparation methods are designed to support your specific nutritional needs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Health Recipes. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
} 