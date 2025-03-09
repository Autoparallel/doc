import { NextRequest, NextResponse } from 'next/server';
import { processHealthData, HealthData } from '@/lib/llm';

export async function POST(req: NextRequest) {
    try {
        // Get the health data from the request
        const data = await req.json() as HealthData;

        console.log('API received health data:', JSON.stringify(data));

        // Validate inputs with detailed logging
        if (!data) {
            console.error('Health data is null or undefined');
            return NextResponse.json(
                { error: 'No health data provided' },
                { status: 400 }
            );
        }

        if (!data.files && !data.personalInfo) {
            console.error('Both files and personalInfo are missing or null');
            return NextResponse.json(
                { error: 'No health data provided: both files and personal info are missing' },
                { status: 400 }
            );
        }

        if (data.personalInfo && Object.keys(data.personalInfo).length === 0) {
            console.error('personalInfo object is empty');
            if (!data.files || Object.values(data.files).every(f => f === null)) {
                console.error('files are also missing or all null');
                return NextResponse.json(
                    { error: 'No health data provided: empty personalInfo and no files' },
                    { status: 400 }
                );
            }
        }

        console.log('Health data validation passed, processing with Claude API');

        try {
            // Process the health data using the Claude API integration
            const recipes = await processHealthData(data);

            console.log(`Successfully generated ${recipes.length} recipes`);

            // Return the recipes
            return NextResponse.json({ recipes });
        } catch (error: unknown) {
            console.error('Error from Claude API:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error during recipe generation';

            return NextResponse.json(
                { error: errorMessage },
                { status: 500 }
            );
        }

    } catch (error: unknown) {
        console.error('Error processing request:', error);

        const errorMessage = error instanceof Error ? error.message : 'Failed to process health data';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
} 