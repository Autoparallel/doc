'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

// Define Recipe type directly to avoid import issues
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
    tags?: string;
    benefits?: string;
}

export default function RecipesPage() {
    const { status } = useSession();
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        // Load recipes if authenticated
        if (status === 'authenticated') {
            loadRecipes();
        }
    }, [status, router]);

    const loadRecipes = () => {
        try {
            console.log('Attempting to load recipes from session storage...');

            // Ensure we're on the client side
            if (typeof window === 'undefined') {
                console.error('Window object is not available');
                setError('Browser storage is not available');
                setLoading(false);
                return;
            }

            // Get recipes from session storage
            const recipesJson = sessionStorage.getItem('recipes');
            console.log('Retrieved from storage:', recipesJson);

            if (!recipesJson) {
                console.log('No recipes found in session storage');
                setError('No recipes found. Please generate recipes first.');
                setLoading(false);
                return;
            }

            try {
                // Parse the JSON
                const parsedRecipes = JSON.parse(recipesJson);
                console.log('Parsed recipes:', parsedRecipes);

                if (Array.isArray(parsedRecipes) && parsedRecipes.length > 0) {
                    setRecipes(parsedRecipes);
                } else {
                    console.log('Parsed recipes are empty or not an array');
                    setError('No recipes found. Please generate recipes first.');
                }
            } catch (parseError) {
                console.error('Error parsing recipes JSON:', parseError);
                setError('Error parsing recipe data');
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
            setError('An error occurred while loading recipes');
        } finally {
            setLoading(false);
        }
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
                            <Link href="/upload" className="nav-link">
                                Generate New Recipes
                            </Link>
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content section-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Your Personalized Recipes
                        </h1>
                        <p className="mt-2 text-lg text-muted">
                            Based on your health data, we&apos;ve created these personalized recipes for you.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 card text-center">
                            <p className="text-muted mb-4">{error}</p>
                            <Link
                                href="/upload"
                                className="btn btn-primary"
                            >
                                Generate Recipes
                            </Link>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center my-12">
                            <div className="spinner rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map((recipe, index) => (
                                <div key={recipe.id || index} className="card">
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        {recipe.title}
                                    </h3>

                                    <p className="text-muted mb-4 line-clamp-3">
                                        {recipe.description}
                                    </p>

                                    <div className="flex justify-between items-center text-sm text-muted mb-4">
                                        {recipe.prepTime && <div>Prep: {recipe.prepTime}</div>}
                                        {recipe.cookTime && <div>Cook: {recipe.cookTime}</div>}
                                        {recipe.calories && <div>{recipe.calories} cal</div>}
                                    </div>

                                    <Link
                                        href={`/recipes/${recipe.id}`}
                                        className="btn btn-primary inline-block mt-2"
                                    >
                                        View Recipe
                                    </Link>
                                </div>
                            ))}
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