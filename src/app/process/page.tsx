'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { HealthData } from '@/lib/openai';

export default function ProcessPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('Starting analysis...');

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

        // Get the health data from session storage
        const processHealthData = async () => {
            try {
                const healthDataString = sessionStorage.getItem('healthData');

                if (!healthDataString) {
                    console.error('No health data found in session storage');
                    return;
                }

                const healthData = JSON.parse(healthDataString) as HealthData;

                // Call our API to process the health data
                const response = await fetch('/api/process-health-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(healthData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to process health data');
                }

                const data = await response.json();

                // In a real application, we would use the actual response
                // For demonstration purposes, we'll use our mock data
                // Store recipes in session storage for the recipes page
                sessionStorage.setItem('recipes', JSON.stringify(data.recipes || []));
            } catch (error) {
                console.error('Error processing health data:', error);
                // Even on error, we'll continue with the progress animation
                // In a real app, we might show an error message and redirect back to upload
            }
        };

        // Start processing the health data
        processHealthData();

        return () => clearInterval(interval);
    }, [progress, router]);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white dark:bg-gray-900 shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="font-bold text-xl text-blue-600">
                            Health Recipes
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-8">
                <div className="max-w-xl w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Processing Your Health Data
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Our AI is analyzing your information to create personalized recipe recommendations.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                        <div className="mb-4">
                            <div className="relative pt-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="text-sm font-semibold inline-block text-blue-600">
                                            Analysis Progress
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold inline-block text-blue-600">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="text-center py-4">
                            <div className="mb-4">
                                <svg
                                    className="animate-spin h-10 w-10 text-blue-600 mx-auto"
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
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                            <p className="text-md text-gray-700 dark:text-gray-300">
                                {statusMessage}
                            </p>
                        </div>

                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                This process usually takes less than a minute. Please don&apos;t close your browser.
                            </p>
                        </div>
                    </div>
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