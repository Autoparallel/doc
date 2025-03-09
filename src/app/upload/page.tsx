'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

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
        if (e.target.files && e.target.files[0]) {
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
            // Convert form data to the format expected by API
            const formattedData: HealthData = {
                personalInfo: {
                    age: personalInfo.age ? parseInt(personalInfo.age) : undefined,
                    weight: personalInfo.weight ? parseFloat(personalInfo.weight) : undefined,
                    height: personalInfo.height ? parseFloat(personalInfo.height) : undefined,
                    allergies: personalInfo.allergies || undefined,
                    conditions: personalInfo.conditions || undefined,
                    goals: personalInfo.goals || undefined
                },
                files: files
            };

            // For demo purposes, just log the data and move to the next page
            console.log('Health data submitted:', formattedData);

            // Store in session storage for demo purposes
            const healthData = {
                age: formattedData.personalInfo?.age || 35,
                weight: formattedData.personalInfo?.weight || 75.5,
                height: formattedData.personalInfo?.height || 175,
                allergies: formattedData.personalInfo?.allergies || 'Peanuts, Shellfish',
                conditions: formattedData.personalInfo?.conditions || 'High cholesterol',
                goals: formattedData.personalInfo?.goals || 'Weight management, Reduce cholesterol'
            };

            // Store in session storage
            sessionStorage.setItem('healthData', JSON.stringify(healthData));

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to recipe generation/processing page
            router.push('/process');
        } catch (err) {
            console.error('Error submitting health data:', err);
            setError('There was an error submitting your health data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

            <main className="main-content section-dark py-8">
                <div className="max-w-3xl mx-auto card">
                    <h1 className="text-2xl font-bold text-white mb-6">
                        Upload Health Data
                    </h1>

                    {error && (
                        <div className="mb-6 muted-card border-red-500">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h2 className="text-lg font-medium text-white mb-4">
                                Health Files (Optional)
                            </h2>
                            <p className="text-sm text-muted mb-4">
                                Upload any health-related documents you have. This helps us create more personalized recipe recommendations.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="muted-card accent-border">
                                    <h3 className="font-medium text-white mb-2">Lab Results</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'lab')}
                                        className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:bg-opacity-10 file:text-accent hover:file:bg-opacity-20"
                                    />
                                    {files.lab && (
                                        <p className="mt-2 text-sm text-muted">
                                            Selected: {files.lab.name}
                                        </p>
                                    )}
                                </div>

                                <div className="muted-card accent-border">
                                    <h3 className="font-medium text-white mb-2">Fitness Data</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'fitness')}
                                        className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:bg-opacity-10 file:text-accent hover:file:bg-opacity-20"
                                    />
                                    {files.fitness && (
                                        <p className="mt-2 text-sm text-muted">
                                            Selected: {files.fitness.name}
                                        </p>
                                    )}
                                </div>

                                <div className="muted-card accent-border">
                                    <h3 className="font-medium text-white mb-2">Medical Records</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'medical')}
                                        className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:bg-opacity-10 file:text-accent hover:file:bg-opacity-20"
                                    />
                                    {files.medical && (
                                        <p className="mt-2 text-sm text-muted">
                                            Selected: {files.medical.name}
                                        </p>
                                    )}
                                </div>

                                <div className="muted-card accent-border">
                                    <h3 className="font-medium text-white mb-2">Diet Records</h3>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'diet')}
                                        className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:bg-opacity-10 file:text-accent hover:file:bg-opacity-20"
                                    />
                                    {files.diet && (
                                        <p className="mt-2 text-sm text-muted">
                                            Selected: {files.diet.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-medium text-white mb-4">
                                Personal Information (Optional)
                            </h2>
                            <p className="text-sm text-muted mb-4">
                                Provide any personal health information that might help us create better recipe recommendations.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-muted mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={personalInfo.age}
                                        onChange={handleInputChange}
                                        placeholder="Years"
                                        className="block w-full rounded-md border-gray-700 focus:border-accent focus:ring-accent bg-subtle text-white text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-muted mb-1">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        value={personalInfo.weight}
                                        onChange={handleInputChange}
                                        placeholder="Kilograms"
                                        step="0.1"
                                        className="block w-full rounded-md border-gray-700 focus:border-accent focus:ring-accent bg-subtle text-white text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="height" className="block text-sm font-medium text-muted mb-1">
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        value={personalInfo.height}
                                        onChange={handleInputChange}
                                        placeholder="Centimeters"
                                        className="block w-full rounded-md border-gray-700 focus:border-accent focus:ring-accent bg-subtle text-white text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="allergies" className="block text-sm font-medium text-muted mb-1">
                                    Allergies or Food Intolerances
                                </label>
                                <input
                                    type="text"
                                    id="allergies"
                                    name="allergies"
                                    value={personalInfo.allergies}
                                    onChange={handleInputChange}
                                    placeholder="e.g., peanuts, dairy, gluten"
                                    className="block w-full rounded-md border-gray-700 focus:border-accent focus:ring-accent bg-subtle text-white text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="conditions" className="block text-sm font-medium text-muted mb-1">
                                    Medical Conditions
                                </label>
                                <input
                                    type="text"
                                    id="conditions"
                                    name="conditions"
                                    value={personalInfo.conditions}
                                    onChange={handleInputChange}
                                    placeholder="e.g., diabetes, hypertension, IBS"
                                    className="block w-full rounded-md border-gray-700 focus:border-accent focus:ring-accent bg-subtle text-white text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="goals" className="block text-sm font-medium text-muted mb-1">
                                    Health Goals
                                </label>
                                <textarea
                                    id="goals"
                                    name="goals"
                                    rows={3}
                                    value={personalInfo.goals}
                                    onChange={handleInputChange}
                                    placeholder="e.g., weight loss, muscle gain, better digestion"
                                    className="block w-full rounded-md border-gray-700 focus:border-accent focus:ring-accent bg-subtle text-white text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn ${isSubmitting ? 'bg-accent bg-opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Health Data'}
                            </button>
                        </div>
                    </form>
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