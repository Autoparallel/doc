'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DemoLoginCard() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDemoLogin = async () => {
        try {
            setIsLoading(true);
            const result = await signIn('credentials', {
                redirect: false,
                email: 'demo@example.com',
                password: 'password123',
            });

            if (result?.error) {
                console.error('Demo login failed:', result.error);
                setIsLoading(false);
                return;
            }

            router.push('/dashboard');
        } catch (error) {
            console.error('Demo login error:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="flex items-center mb-4">
                <div className="icon-circle mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                    Try the Demo Account
                </h3>
            </div>
            <div className="mb-5">
                <p className="text-sm mb-3 text-muted">
                    You can explore the app with our pre-configured demo account:
                </p>
                <div className="muted-card mb-3 accent-border">
                    <div className="flex items-center mb-2">
                        <span className="text-muted text-sm font-medium mr-2">Email:</span>
                        <span className="text-white">demo@example.com</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-muted text-sm font-medium mr-2">Password:</span>
                        <span className="text-white">password123</span>
                    </div>
                </div>
                <p className="text-xs text-muted">
                    This account has pre-loaded health data and recipes for demonstration purposes.
                </p>
            </div>
            <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="btn btn-primary w-full"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <svg className="spinner -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </span>
                ) : (
                    'Login as Demo User'
                )}
            </button>
        </div>
    );
} 