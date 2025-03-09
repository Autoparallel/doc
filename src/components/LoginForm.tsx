'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password');
                setIsLoading(false);
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
                Log In to Your Account
            </h2>

            {error && (
                <div className="mb-4 p-3 muted-card border border-red-500 text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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

                <div className="mb-6">
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
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn w-full ${isLoading ? 'bg-accent bg-opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-muted">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-accent hover:text-accent">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
} 