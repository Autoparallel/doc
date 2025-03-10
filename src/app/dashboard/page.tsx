'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import StravaConnectButton from '@/components/StravaConnectButton';

// Define types for our data
interface HealthData {
    id?: string;
    age?: number;
    weight?: number;
    height?: number;
    allergies?: string;
    conditions?: string;
    goals?: string;
}

interface Recipe {
    id: string;
    title: string;
    description: string;
    image?: string;
    prepTime?: string;
    cookTime?: string;
    calories?: number;
    tags?: string;
    benefits?: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        // Fetch user data if authenticated
        if (status === 'authenticated') {
            fetchHealthData();
            fetchRecipes();
        }
    }, [status, router]);

    const fetchHealthData = async () => {
        try {
            const response = await fetch('/api/health-data');
            if (response.ok) {
                const data = await response.json();
                setHealthData(data);
            }
        } catch (error) {
            console.error('Error fetching health data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipes = async () => {
        try {
            const response = await fetch('/api/recipes');
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
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
                            <span className="text-muted">
                                Welcome, {session?.user?.name || 'Demo User'}
                            </span>
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content section-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Health Profile Section */}
                        <div className="lg:col-span-1">
                            <div className="card">
                                <h2 className="text-xl font-semibold text-white mb-4">Health Profile</h2>

                                {loading ? (
                                    <div className="py-4 flex justify-center">
                                        <div className="spinner rounded-full h-8 w-8 border-t-2 border-b-2 border-accent" />
                                    </div>
                                ) : healthData && Object.keys(healthData).length > 0 ? (
                                    <div className="space-y-4">
                                        {healthData.age && (
                                            <div>
                                                <p className="text-sm text-muted">Age</p>
                                                <p className="font-medium text-white">{healthData.age} years</p>
                                            </div>
                                        )}
                                        {healthData.height && (
                                            <div>
                                                <p className="text-sm text-muted">Height</p>
                                                <p className="font-medium text-white">{healthData.height} cm</p>
                                            </div>
                                        )}
                                        {healthData.weight && (
                                            <div>
                                                <p className="text-sm text-muted">Weight</p>
                                                <p className="font-medium text-white">{healthData.weight} kg</p>
                                            </div>
                                        )}
                                        {healthData.allergies && (
                                            <div>
                                                <p className="text-sm text-muted">Allergies</p>
                                                <p className="font-medium text-white">{healthData.allergies}</p>
                                            </div>
                                        )}
                                        {healthData.conditions && (
                                            <div>
                                                <p className="text-sm text-muted">Conditions</p>
                                                <p className="font-medium text-white">{healthData.conditions}</p>
                                            </div>
                                        )}
                                        {healthData.goals && (
                                            <div>
                                                <p className="text-sm text-muted">Goals</p>
                                                <p className="font-medium text-white">{healthData.goals}</p>
                                            </div>
                                        )}
                                        <Link
                                            href="/upload"
                                            className="btn btn-primary mt-4 block w-full text-center"
                                        >
                                            Update Health Data
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-muted mb-4">No health data available.</p>
                                        <Link
                                            href="/upload"
                                            className="btn btn-primary"
                                        >
                                            Upload Health Data
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Strava Integration Section */}
                            <div className="card mt-8">
                                <StravaConnectButton />
                            </div>
                        </div>

                        {/* Saved Recipes Section */}
                        <div className="lg:col-span-2">
                            <div className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-white">Your Saved Recipes</h2>
                                    <Link
                                        href="/recipes"
                                        className="text-sm text-accent hover:text-accent"
                                    >
                                        View All Recipes
                                    </Link>
                                </div>

                                {recipes.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {recipes.slice(0, 4).map((recipe) => (
                                            <div key={recipe.id} className="muted-card accent-border">
                                                <h3 className="font-medium mb-2 text-white">{recipe.title}</h3>
                                                <p className="text-sm text-muted mb-3 line-clamp-2">
                                                    {recipe.description}
                                                </p>
                                                <Link
                                                    href={`/recipes/${recipe.id}`}
                                                    className="text-sm text-accent hover:text-accent"
                                                >
                                                    View Recipe
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted mb-4">You haven&apos;t saved any recipes yet.</p>
                                        <Link
                                            href="/upload"
                                            className="btn btn-primary"
                                        >
                                            Generate New Recipes
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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