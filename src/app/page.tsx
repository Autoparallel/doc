'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import DemoLoginCard from '@/components/DemoLoginCard';
import SignOutButton from '@/components/SignOutButton';

export default function HomePage() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="page-container">
      <header className="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-accent">
              Health Recipes
            </Link>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="nav-link"
                  >
                    Dashboard
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="nav-link"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero section */}
        <section className="section section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8 inline-block p-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
              <div className="bg-[#161616] p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Personalized Recipes Based on Your Health Data
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted">
              Get recipe recommendations tailored to your specific health needs, goals, and
              preferences.
            </p>
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn btn-primary">
                View Your Recipes
              </Link>
            ) : (
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            )}
          </div>
        </section>

        {/* Demo account section - only visible to unauthenticated users */}
        {!isAuthenticated && (
          <section className="section section-dark">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
              <DemoLoginCard />
            </div>
          </section>
        )}

        {/* Features section */}
        <section className="section section-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="badge badge-accent mb-3">How It Works</span>
              <h2 className="text-3xl font-bold text-white">Your Journey to Better Health</h2>
            </div>

            {/* Steps section */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative">
                  <div className="bg-subtle p-6 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-accent text-2xl font-bold">1</span>
                  </div>
                  <div className="hidden md:block step-connector"></div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Upload Health Data</h3>
                <p className="text-muted">
                  Connect your health app or manually enter your health metrics and dietary preferences.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative">
                  <div className="bg-subtle p-6 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-accent text-2xl font-bold">2</span>
                  </div>
                  <div className="hidden md:block step-connector"></div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">AI Analysis</h3>
                <p className="text-muted">
                  Our AI analyzes your health data to identify nutritional needs and dietary recommendations.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative">
                  <div className="bg-subtle p-6 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-accent text-2xl font-bold">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Get Personalized Recipes</h3>
                <p className="text-muted">
                  Receive tailored recipes that support your health goals and match your preferences.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-accent font-semibold">
                Health Recipes
              </Link>
            </div>
            <p className="text-center text-muted text-sm">
              © {new Date().getFullYear()} Health Recipes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
