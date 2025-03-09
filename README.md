# Health Recipes App

A web application that generates personalized recipe recommendations based on your health data.

## Features

- Upload health data (lab results, fitness tracker info, medical records, diet logs)
- Enter personal health information
- Get AI-powered recipe recommendations tailored to your health needs
- View detailed recipes with nutritional information and health benefits

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude API

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/autoparallel/doc.git
   cd doc
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Click "Get Started" on the homepage
2. Upload your health data files and/or enter your personal health information
3. Submit the form to process your data
4. View your personalized recipe recommendations
5. Click on a recipe to see detailed information, ingredients, and instructions

## Getting an Anthropic API Key

To use this application, you'll need an API key from Anthropic:

1. Visit [Anthropic's Console](https://console.anthropic.com/) and create an account
2. Go to the API Keys section to create a new API key
3. Copy the API key and paste it into your `.env.local` file

Anthropic offers a free tier with limited usage, which should be enough for testing this application.

## Future Enhancements

- User authentication and profiles
- Save favorite recipes
- Generate shopping lists
- Meal planning features
- More detailed health data analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details.
