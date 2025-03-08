'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FileType = 'lab' | 'fitness' | 'medical' | 'diet';

// Define the health data interface
interface HealthData {
    personalInfo: {
        age?: number;
        weight?: number;
        height?: number;
        allergies?: string;
        conditions?: string;
        goals?: string;
    } | null;
    files: {
        lab: File | null;
        fitness: File | null;
        medical: File | null;
        diet: File | null;
    };
}

export default function UploadPage() {
    const router = useRouter();
    const [files, setFiles] = useState<{
        lab: File | null;
        fitness: File | null;
        medical: File | null;
        diet: File | null;
    }>({
        lab: null,
        fitness: null,
        medical: null,
        diet: null
    });

    const [personalInfo, setPersonalInfo] = useState({
        age: '',
        weight: '',
        height: '',
        allergies: '',
        conditions: '',
        goals: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: FileType) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prev => ({
                ...prev,
                [type]: e.target.files![0]
            }));
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Check if at least one file or some personal information is provided
            const hasFiles = Object.values(files).some(file => file !== null);
            const hasPersonalInfo = Object.values(personalInfo).some(value => value.trim() !== '');

            if (!hasFiles && !hasPersonalInfo) {
                throw new Error('Please provide at least one health file or some personal information.');
            }

            // Create health data object
            const healthData: HealthData = {
                personalInfo: hasPersonalInfo ? {
                    age: personalInfo.age.trim() ? Number(personalInfo.age) : undefined,
                    weight: personalInfo.weight.trim() ? Number(personalInfo.weight) : undefined,
                    height: personalInfo.height.trim() ? Number(personalInfo.height) : undefined,
                    allergies: personalInfo.allergies.trim() || undefined,
                    conditions: personalInfo.conditions.trim() || undefined,
                    goals: personalInfo.goals.trim() || undefined
                } : null,
                files: {
                    lab: files.lab,
                    fitness: files.fitness,
                    medical: files.medical,
                    diet: files.diet
                }
            };

            // Clean healthData - remove undefined properties if personalInfo is not null
            if (healthData.personalInfo) {
                Object.keys(healthData.personalInfo).forEach(key => {
                    const typedKey = key as keyof typeof healthData.personalInfo;
                    if (healthData.personalInfo && healthData.personalInfo[typedKey] === undefined) {
                        delete healthData.personalInfo[typedKey];
                    }
                });

                // Check if we have any personal info left after cleaning
                if (healthData.personalInfo && Object.keys(healthData.personalInfo).length === 0) {
                    healthData.personalInfo = null;
                }
            }

            console.log('Saving health data to session storage:', healthData);

            // Save health data to session storage
            sessionStorage.setItem('healthData', JSON.stringify(healthData));

            // Verify the data was saved
            const savedData = sessionStorage.getItem('healthData');
            console.log('Verified health data in session storage:', savedData);

            if (!savedData) {
                throw new Error('Failed to save health data to session storage');
            }

            console.log('Redirecting to process page...');

            // Redirect to process page
            router.push('/process');
        } catch (error) {
            console.error('Error submitting health data:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            setIsSubmitting(false);
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

            <main className="flex-grow p-6">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Upload Health Data
                    </h1>

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Health Files (Optional)
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Upload any health-related documents you have. This helps us create more personalized recipe recommendations.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                                    <h3 className="font-medium mb-2">Lab Results</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'lab')}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {files.lab && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Selected: {files.lab.name}
                                        </p>
                                    )}
                                </div>

                                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                                    <h3 className="font-medium mb-2">Fitness Data</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'fitness')}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {files.fitness && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Selected: {files.fitness.name}
                                        </p>
                                    )}
                                </div>

                                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                                    <h3 className="font-medium mb-2">Medical Records</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'medical')}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {files.medical && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Selected: {files.medical.name}
                                        </p>
                                    )}
                                </div>

                                <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                                    <h3 className="font-medium mb-2">Diet Records</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'diet')}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {files.diet && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Selected: {files.diet.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Personal Information (Optional)
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Provide any personal health information that might help us create better recipe recommendations.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={personalInfo.age}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        value={personalInfo.weight}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        value={personalInfo.height}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Allergies or Food Intolerances
                                </label>
                                <input
                                    type="text"
                                    id="allergies"
                                    name="allergies"
                                    value={personalInfo.allergies}
                                    onChange={handleInputChange}
                                    placeholder="e.g., peanuts, dairy, gluten"
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Medical Conditions
                                </label>
                                <input
                                    type="text"
                                    id="conditions"
                                    name="conditions"
                                    value={personalInfo.conditions}
                                    onChange={handleInputChange}
                                    placeholder="e.g., diabetes, hypertension, IBS"
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Health Goals
                                </label>
                                <textarea
                                    id="goals"
                                    name="goals"
                                    rows={3}
                                    value={personalInfo.goals}
                                    onChange={handleInputChange}
                                    placeholder="e.g., weight loss, muscle gain, better digestion"
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Health Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Health Recipes. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
} 