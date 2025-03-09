import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
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
                <div className="w-full max-w-md">
                    <LoginForm />
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