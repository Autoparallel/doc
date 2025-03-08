import { NextRequest, NextResponse } from 'next/server';
import { processHealthData, HealthData } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        // Get the health data from the request
        const data = await req.json() as HealthData;

        // Validate inputs
        if (!data ||
            (!data.files && !data.personalInfo) ||
            (data.personalInfo && Object.values(data.personalInfo).every(v => !v))) {
            return NextResponse.json(
                { error: 'No health data provided' },
                { status: 400 }
            );
        }

        // Process the health data using the OpenAI integration
        const recipes = await processHealthData(data);

        // Return the recipes
        return NextResponse.json({ recipes });

    } catch (error: unknown) {
        console.error('Error processing health data:', error);

        const errorMessage = error instanceof Error ? error.message : 'Failed to process health data';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
} 