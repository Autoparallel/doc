'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Redirect to login page on success
            router.push('/login?registered=true');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
                Create Your Account
            </h2>

            {error && (
                <div className="mb-4 p-3 muted-card border border-red-500 text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-muted mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        required
                        minLength={6}
                    />
                    <p className="mt-1 text-xs text-muted">
                        Password must be at least 6 characters long
                    </p>
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted mb-1">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn w-full ${isLoading ? 'bg-accent bg-opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                >
                    {isLoading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-muted">
                    Already have an account?{' '}
                    <Link href="/login" className="text-accent hover:text-accent">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
} 