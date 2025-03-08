import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
            Personalized Recipes Based on Your Health Data
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
            Upload your health information and get AI-powered recipe recommendations
            tailored specifically to your body&apos;s needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="px-8 py-3 text-lg font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-3 text-lg font-medium rounded-full border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your health data from lab results, fitness trackers, or medical records.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our advanced AI analyzes your data to identify your unique nutritional needs.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Personalized Recipes</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive customized recipes designed to improve your specific health metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-800 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Health Recipes. All rights reserved.</p>
      </footer>
    </div>
  );
}
