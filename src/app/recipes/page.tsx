'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import RecipeCard from '../../components/RecipeCard';
import { mockRecipes } from '../../lib/mock-data';
import type { Recipe } from '../../lib/llm';

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const hasLoadedRealData = useRef(false);

    // Function to load recipes from session storage
    const loadRecipes = () => {
        try {
            console.log('Checking for recipes in session storage...');

            // Ensure we're on the client side
            if (typeof window === 'undefined') {
                console.error('Window object is not available');
                setError('Browser storage is not available');
                setLoading(false);
                return;
            }

            // Get recipes from session storage
            const recipesJson = sessionStorage.getItem('recipes');

            if (!recipesJson) {
                if (!usingMockData) {
                    console.log('No recipes found in session storage, using mock data');
                    setRecipes(mockRecipes);
                    setUsingMockData(true);
                }
                setLoading(false);
                return;
            }

            try {
                // Parse the JSON
                const parsedRecipes = JSON.parse(recipesJson);

                if (Array.isArray(parsedRecipes) && parsedRecipes.length > 0) {
                    // Check if the parsed recipes are different from the current recipes
                    const areNewRecipes = JSON.stringify(parsedRecipes) !== JSON.stringify(recipes);

                    if (areNewRecipes) {
                        console.log('Found new recipes in session storage, updating UI');
                        console.log('First recipe title:', parsedRecipes[0]?.title);
                        setRecipes(parsedRecipes);
                        setUsingMockData(false);
                        hasLoadedRealData.current = true;

                        // Show alert when real data is loaded
                        if (usingMockData) {
                            alert('Your personalized recipes are now ready!');
                        }
                    }
                } else {
                    if (!usingMockData) {
                        console.log('Parsed recipes are empty or not an array, using mock data');
                        setRecipes(mockRecipes);
                        setUsingMockData(true);
                    }
                }
            } catch (parseError) {
                console.error('Error parsing recipes JSON:', parseError);
                if (!usingMockData) {
                    setError('Error parsing recipe data');
                    setRecipes(mockRecipes);
                    setUsingMockData(true);
                }
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
            if (!usingMockData) {
                setError('An error occurred while loading recipes');
                setRecipes(mockRecipes);
                setUsingMockData(true);
            }
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        // Log current mock recipes for debugging
        console.log('Mock recipe titles:', mockRecipes.map(r => r.title));

        loadRecipes();

        // Set up polling to check for new recipes every 2 seconds
        const pollingInterval = setInterval(() => {
            // Only poll if we haven't loaded real data yet
            if (!hasLoadedRealData.current) {
                loadRecipes();
            } else {
                console.log('Already loaded real data, stopping polling');
                clearInterval(pollingInterval);
            }
        }, 2000);

        // Clean up the interval when component unmounts
        return () => clearInterval(pollingInterval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white dark:bg-gray-900 shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="font-bold text-xl text-blue-600">
                            Health Recipes
                        </Link>
                        <Link href="/upload" className="text-sm text-blue-600 hover:text-blue-500">
                            Upload New Health Data
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Your Personalized Recipes
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                            Based on your health data, we&apos;ve created these personalized recipes for you.
                        </p>
                        {!usingMockData && (
                            <p className="mt-2 text-sm font-semibold text-green-600">
                                ✅ These are your AI-generated personalized recipes
                            </p>
                        )}
                    </div>

                    {usingMockData && !error && (
                        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-center">
                            <p className="text-blue-600 dark:text-blue-300">
                                Showing example recipes while your personalized recommendations are being generated...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-center">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                Showing example recipes instead.
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center my-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map((recipe, index) => (
                                <RecipeCard key={recipe.id || index} recipe={recipe} />
                            ))}
                        </div>
                    )}
                </div>
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