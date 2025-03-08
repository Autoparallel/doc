'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { HealthData } from '@/lib/openai';

type FileType = 'lab' | 'fitness' | 'medical' | 'diet';

export default function UploadPage() {
    const router = useRouter();
    const [files, setFiles] = useState<Record<FileType, File | null>>({
        lab: null,
        fitness: null,
        medical: null,
        diet: null,
    });

    const [personalInfo, setPersonalInfo] = useState({
        age: '',
        sex: '',
        height: '',
        weight: '',
        allergies: '',
        dietaryPreferences: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (type: FileType, file: File | null) => {
        setFiles(prev => ({ ...prev, [type]: file }));
    };

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Check if at least one file or some personal info is provided
        const hasFiles = Object.values(files).some(file => file !== null);
        const hasInfo = Object.values(personalInfo).some(value => value.trim() !== '');

        if (!hasFiles && !hasInfo) {
            setError('Please upload at least one file or provide some personal information');
            setIsLoading(false);
            return;
        }

        try {
            // In a real application, we would process and read the file contents
            // For demonstration purposes, we'll just send the personal info to the API

            // Create a health data object to send to the API
            const healthData: HealthData = {
                personalInfo
            };

            // Store the health data in session storage for the process page to use
            sessionStorage.setItem('healthData', JSON.stringify(healthData));

            // Redirect to the process page
            router.push('/process');
        } catch (err) {
            setError('There was an error uploading your data. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

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

            <main className="flex-grow py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Upload Your Health Data
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                To provide you with personalized recipe recommendations, we need some information about your health.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-1 gap-y-8">
                                    {/* Health Data Files Section */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                            Health Data Files
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Lab Results */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Lab Results (PDF, CSV)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.csv,.xlsx,.txt"
                                                    onChange={(e) => handleFileChange('lab', e.target.files?.[0] || null)}
                                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                                                />
                                            </div>

                                            {/* Fitness Tracker Data */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Fitness Tracker Data (CSV, JSON)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".csv,.json,.txt"
                                                    onChange={(e) => handleFileChange('fitness', e.target.files?.[0] || null)}
                                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                                                />
                                            </div>

                                            {/* Medical Records */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Medical Records (PDF, DOCX)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.docx,.txt"
                                                    onChange={(e) => handleFileChange('medical', e.target.files?.[0] || null)}
                                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                                                />
                                            </div>

                                            {/* Diet Logs */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Diet Logs (PDF, CSV)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.csv,.txt"
                                                    onChange={(e) => handleFileChange('diet', e.target.files?.[0] || null)}
                                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Information Section */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                            Personal Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Age */}
                                            <div>
                                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Age
                                                </label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    id="age"
                                                    min="1"
                                                    max="120"
                                                    value={personalInfo.age}
                                                    onChange={handlePersonalInfoChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 
                            dark:text-white sm:text-sm"
                                                />
                                            </div>

                                            {/* Sex */}
                                            <div>
                                                <label htmlFor="sex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Sex
                                                </label>
                                                <select
                                                    id="sex"
                                                    name="sex"
                                                    value={personalInfo.sex}
                                                    onChange={handlePersonalInfoChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 
                            dark:text-white sm:text-sm"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                                </select>
                                            </div>

                                            {/* Height */}
                                            <div>
                                                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Height (cm)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="height"
                                                    id="height"
                                                    min="50"
                                                    max="250"
                                                    value={personalInfo.height}
                                                    onChange={handlePersonalInfoChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 
                            dark:text-white sm:text-sm"
                                                />
                                            </div>

                                            {/* Weight */}
                                            <div>
                                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Weight (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    id="weight"
                                                    min="1"
                                                    max="500"
                                                    value={personalInfo.weight}
                                                    onChange={handlePersonalInfoChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 
                            dark:text-white sm:text-sm"
                                                />
                                            </div>

                                            {/* Allergies */}
                                            <div className="md:col-span-2">
                                                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Allergies or Food Intolerances
                                                </label>
                                                <textarea
                                                    id="allergies"
                                                    name="allergies"
                                                    rows={2}
                                                    value={personalInfo.allergies}
                                                    onChange={handlePersonalInfoChange}
                                                    placeholder="e.g., peanuts, shellfish, gluten, lactose"
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 
                            dark:text-white sm:text-sm"
                                                />
                                            </div>

                                            {/* Dietary Preferences */}
                                            <div className="md:col-span-2">
                                                <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Dietary Preferences
                                                </label>
                                                <textarea
                                                    id="dietaryPreferences"
                                                    name="dietaryPreferences"
                                                    rows={2}
                                                    value={personalInfo.dietaryPreferences}
                                                    onChange={handlePersonalInfoChange}
                                                    placeholder="e.g., vegetarian, vegan, low-carb, keto, Mediterranean"
                                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 
                            dark:text-white sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mt-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                                        <div className="flex">
                                            <div className="text-sm font-medium text-red-800 dark:text-red-400">
                                                {error}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
                                <Link
                                    href="/"
                                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 
                    shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 
                    hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-blue-500 mr-3"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm 
                    px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Processing...' : 'Analyze My Health Data'}
                                </button>
                            </div>
                        </form>
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