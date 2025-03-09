'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SignOutButton from '@/components/SignOutButton';

// Define a Recipe type directly in this file to avoid import issues
interface Recipe {
    id?: string | number;
    title: string;
    description: string;
    image?: string;
    prepTime?: string;
    cookTime?: string;
    calories?: number;
    protein?: string;
    carbs?: string;
    fats?: string;
    // Arrays or comma-separated strings are both supported
    tags?: string[] | string;
    benefits?: string[] | string;
    ingredients?: string[] | string;
    instructions?: string[] | string;
}

export default function RecipeDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { status } = useSession();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        // Fetch recipe if authenticated
        if (status === 'authenticated') {
            fetchRecipe();
        }
    }, [status, router, params]);

    // Add this debugging useEffect
    useEffect(() => {
        if (recipe) {
            console.log('Recipe data structure:', recipe);
            console.log('Tags type:', typeof recipe.tags, Array.isArray(recipe.tags) ? 'array' : 'not array');
            console.log('Benefits type:', typeof recipe.benefits, Array.isArray(recipe.benefits) ? 'array' : 'not array');
            console.log('Ingredients type:', typeof recipe.ingredients, Array.isArray(recipe.ingredients) ? 'array' : 'not array');
            console.log('Instructions type:', typeof recipe.instructions, Array.isArray(recipe.instructions) ? 'array' : 'not array');
        }
    }, [recipe]);

    const fetchRecipe = async () => {
        if (!params?.id) {
            console.error('No recipe ID provided in URL parameters');
            setError('Recipe ID is missing');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log(`Fetching recipe with ID: ${params.id}`);

            // First, try getting from in-memory mock data for demo experience
            const recipesJson = sessionStorage.getItem('recipes');
            console.log('Session storage recipes:', recipesJson ? 'Found' : 'Not found');

            if (recipesJson) {
                try {
                    const recipes = JSON.parse(recipesJson);
                    console.log(`Found ${recipes.length} recipes in session storage`);

                    const found = recipes.find((r: Recipe) => {
                        console.log(`Comparing recipe ID: ${r.id} (${typeof r.id}) with params.id: ${params.id} (${typeof params.id})`);
                        return r.id?.toString() === params.id;
                    });

                    if (found) {
                        console.log('Recipe found in session storage:', found);
                        setRecipe(found);
                        setLoading(false);
                        return;
                    } else {
                        console.log('Recipe not found in session storage, trying API');
                    }
                } catch (parseError) {
                    console.error('Error parsing recipes from session storage:', parseError);
                }
            }

            // If not found in session, try API
            console.log(`Fetching recipe from API: /api/recipes/${params.id}`);
            const response = await fetch(`/api/recipes/${params.id}`);
            console.log('API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Recipe data from API:', data);
                setRecipe(data);
            } else {
                console.error(`Error fetching recipe: ${response.status}`);
                if (response.status === 404) {
                    setError('Recipe not found');
                } else {
                    setError('Error loading recipe');
                }
            }
        } catch (fetchError) {
            console.error('Error fetching recipe:', fetchError);
            setError('Failed to load recipe data');
        } finally {
            setLoading(false);
        }
    };

    // Utility function to parse string or array into array
    const parseList = (value?: string[] | string): string[] => {
        if (!value) return [];

        if (Array.isArray(value)) {
            return value;
        }

        // If it's a string, split by comma and trim whitespace
        return value.split(',').map(item => item.trim());
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-subtle">
                <div className="spinner rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
            </div>
        );
    }

    return (
        <div className="page-container">
            <header className="header">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="font-bold text-xl text-accent">
                            Health Recipes
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content section-dark">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="spinner rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
                        </div>
                    ) : error ? (
                        <div className="card text-center py-12">
                            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                            <p className="text-muted mb-6">{error}</p>
                            <Link href="/dashboard" className="btn btn-primary">
                                Back to Dashboard
                            </Link>
                        </div>
                    ) : recipe ? (
                        <div>
                            <div className="mb-6">
                                <Link href="/dashboard" className="text-accent hover:text-accent flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Dashboard
                                </Link>
                            </div>

                            <div className="card">
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{recipe.title}</h1>
                                <p className="text-muted mb-6">{recipe.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white mb-3">Nutrition Information</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {recipe.calories && (
                                                <div className="muted-card">
                                                    <p className="text-sm text-muted">Calories</p>
                                                    <p className="text-lg font-medium text-white">{recipe.calories} kcal</p>
                                                </div>
                                            )}
                                            {recipe.protein && (
                                                <div className="muted-card">
                                                    <p className="text-sm text-muted">Protein</p>
                                                    <p className="text-lg font-medium text-white">{recipe.protein}</p>
                                                </div>
                                            )}
                                            {recipe.carbs && (
                                                <div className="muted-card">
                                                    <p className="text-sm text-muted">Carbs</p>
                                                    <p className="text-lg font-medium text-white">{recipe.carbs}</p>
                                                </div>
                                            )}
                                            {recipe.fats && (
                                                <div className="muted-card">
                                                    <p className="text-sm text-muted">Fats</p>
                                                    <p className="text-lg font-medium text-white">{recipe.fats}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-white mb-3">Preparation</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {recipe.prepTime && (
                                                <div className="muted-card">
                                                    <p className="text-sm text-muted">Prep Time</p>
                                                    <p className="text-lg font-medium text-white">{recipe.prepTime}</p>
                                                </div>
                                            )}
                                            {recipe.cookTime && (
                                                <div className="muted-card">
                                                    <p className="text-sm text-muted">Cook Time</p>
                                                    <p className="text-lg font-medium text-white">{recipe.cookTime}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {recipe.tags && parseList(recipe.tags).length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Tags</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {parseList(recipe.tags).map((tag, index) => (
                                                <span key={index} className="badge badge-accent">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recipe.benefits && parseList(recipe.benefits).length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Health Benefits</h2>
                                        <ul className="list-disc list-inside text-muted">
                                            {parseList(recipe.benefits).map((benefit, index) => (
                                                <li key={index}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {recipe.ingredients && parseList(recipe.ingredients).length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Ingredients</h2>
                                        <ul className="list-disc list-inside text-muted">
                                            {parseList(recipe.ingredients).map((ingredient, index) => (
                                                <li key={index}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {recipe.instructions && parseList(recipe.instructions).length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">Instructions</h2>
                                        <ol className="list-decimal list-inside text-muted">
                                            {parseList(recipe.instructions).map((instruction, index) => (
                                                <li key={index} className="mb-2">{instruction}</li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card text-center py-12">
                            <h2 className="text-2xl font-bold text-white mb-4">Recipe Not Found</h2>
                            <p className="text-muted mb-6">We couldn&apos;t find the recipe you&apos;re looking for.</p>
                            <Link href="/dashboard" className="btn btn-primary">
                                Back to Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-muted">
                        © {new Date().getFullYear()} Health Recipes. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
} 