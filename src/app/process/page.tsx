'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProcessPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('Starting analysis...');
    const [error, setError] = useState<string | null>(null);
    const apiCallMade = useRef(false);

    // Process the health data
    useEffect(() => {
        const statusMessages = [
            'Analyzing health data...',
            'Identifying nutritional needs...',
            'Searching for recipe matches...',
            'Personalizing recommendations...',
            'Finalizing your recipe collection...',
            'Done! Redirecting to your personalized recipes...'
        ];

        let currentStep = 0;

        // Set up the progress animation interval
        const interval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(interval);
                // Redirect to recipes page after 100% completion
                setTimeout(() => {
                    router.push('/recipes');
                }, 1000);
                return;
            }

            // Increase progress based on current step
            setProgress(prev => {
                const newProgress = prev + (Math.random() * 2 + 1);

                // Update status message at certain progress points
                if (newProgress > (currentStep + 1) * 16 && currentStep < statusMessages.length - 1) {
                    currentStep++;
                    setStatusMessage(statusMessages[currentStep]);
                }

                return Math.min(newProgress, 100);
            });
        }, 300);

        // When component unmounts, clear the interval
        return () => clearInterval(interval);
    }, [progress, router]);

    // Simulate API call when component mounts
    useEffect(() => {
        if (apiCallMade.current) return;

        apiCallMade.current = true;

        // Simulate retrieving health data from session storage
        const healthDataJson = typeof window !== 'undefined' ? sessionStorage.getItem('healthData') : null;

        if (!healthDataJson) {
            console.error('No health data found in session storage');
            setError('No health data was found. Please return to the upload page and try again.');
            return;
        }

        let healthData;
        try {
            healthData = JSON.parse(healthDataJson);
            console.log('Retrieved health data:', healthData);
        } catch (e) {
            console.error('Error parsing health data JSON:', e);
            setError('There was an error processing your health data. Please try again.');
            return;
        }

        // Generate mock recipes based on user health data
        const generateMockRecipes = async () => {
            try {
                // Here we would normally make an API call to our LLM service
                // For demo purposes, we'll just simulate a delay and use mock data
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Create mock personalized recipes based on health data
                const mockRecipes = [
                    {
                        id: "rec1",
                        title: "Heart-Healthy Mediterranean Salad",
                        description: "A delicious Mediterranean-inspired salad with olive oil, vegetables, and lean protein to support heart health.",
                        prepTime: "15 minutes",
                        cookTime: "0 minutes",
                        calories: 350,
                        protein: "15g",
                        carbs: "20g",
                        fats: "22g",
                        tags: "heart-healthy,low-sodium,mediterranean",
                        benefits: "Supports cardiovascular health,Rich in antioxidants,Anti-inflammatory",
                        ingredients: "Mixed greens,Cherry tomatoes,Cucumber,Red onion,Kalamata olives,Feta cheese,Grilled chicken breast,Extra virgin olive oil,Lemon juice,Oregano,Black pepper",
                        instructions: "Wash and chop all vegetables,Slice the grilled chicken breast,Combine all ingredients in a large bowl,Whisk together olive oil, lemon juice, oregano and black pepper,Drizzle dressing over salad and toss gently,Serve immediately"
                    },
                    {
                        id: "rec2",
                        title: "Cholesterol-Lowering Oatmeal Bowl",
                        description: "A hearty breakfast bowl with oats, berries, and nuts designed to help lower cholesterol levels.",
                        prepTime: "5 minutes",
                        cookTime: "10 minutes",
                        calories: 320,
                        protein: "10g",
                        carbs: "45g",
                        fats: "12g",
                        tags: "heart-healthy,cholesterol-lowering,breakfast",
                        benefits: "Helps lower LDL cholesterol,Rich in soluble fiber,Provides sustained energy",
                        ingredients: "Steel-cut oats,Almond milk,Fresh berries (blueberries, strawberries),Banana,Walnuts,Flaxseed,Cinnamon,Honey",
                        instructions: "Bring almond milk to a simmer in a pot,Add steel-cut oats and reduce heat,Cook for 7-10 minutes, stirring occasionally,Remove from heat and transfer to a bowl,Top with fresh berries, sliced banana, and walnuts,Sprinkle with flaxseed and cinnamon,Drizzle with a small amount of honey if desired"
                    },
                    {
                        id: "rec3",
                        title: "Anti-Inflammatory Turmeric Smoothie",
                        description: "A nutrient-packed smoothie featuring turmeric, ginger, and fruits to combat inflammation.",
                        prepTime: "5 minutes",
                        cookTime: "0 minutes",
                        calories: 240,
                        protein: "8g",
                        carbs: "35g",
                        fats: "8g",
                        tags: "anti-inflammatory,smoothie,breakfast",
                        benefits: "Reduces inflammation,Supports immune function,Rich in antioxidants",
                        ingredients: "Frozen mango chunks,Frozen pineapple chunks,Banana,Greek yogurt,Turmeric powder,Ginger (fresh or ground),Black pepper,Honey,Water or coconut water",
                        instructions: "Add all ingredients to a blender,Blend until smooth and creamy,Add more liquid if needed to reach desired consistency,Pour into a glass and enjoy immediately"
                    }
                ];

                // Save mock recipes to session storage for demo purposes
                sessionStorage.setItem('recipes', JSON.stringify(mockRecipes));
                console.log('Mock recipes generated and saved to session storage');
            } catch (error) {
                console.error('Error generating mock recipes:', error);
                setError('Failed to generate recipe recommendations. Please try again.');
            }
        };

        // Call the mock recipe generator
        generateMockRecipes();
    }, []);

    return (
        <div className="page-container">
            <header className="header">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="font-bold text-xl text-accent">
                            Health Recipes
                        </Link>
                    </div>
                </div>
            </header>

            <main className="main-content section-dark flex items-center justify-center p-8">
                <div className="max-w-xl w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Processing Your Health Data
                        </h1>
                        <p className="text-lg text-muted">
                            Our AI is analyzing your information to create personalized recipe recommendations.
                        </p>
                    </div>

                    {error ? (
                        <div className="card text-center">
                            <h2 className="text-xl font-semibold text-white mb-3">Error</h2>
                            <p className="text-muted mb-4">{error}</p>
                            <Link
                                href="/upload"
                                className="btn btn-primary"
                            >
                                Go Back to Health Form
                            </Link>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="mb-4">
                                <div className="relative pt-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="text-sm font-semibold inline-block text-accent">
                                                Analysis Progress
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold inline-block text-accent">
                                                {Math.round(progress)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-subtle">
                                        <div
                                            style={{ width: `${progress}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-accent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center py-4">
                                <div className="mb-4">
                                    <svg
                                        className="spinner h-10 w-10 text-accent mx-auto"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                </div>
                                <p className="text-lg font-medium text-white mb-2">{statusMessage}</p>
                                <p className="text-sm text-muted">
                                    This will only take a moment. Please don&apos;t close or refresh the page.
                                </p>
                            </div>
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