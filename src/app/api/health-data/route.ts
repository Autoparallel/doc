import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Get the current user's health data
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const healthData = await prisma.healthData.findUnique({
            where: { userId },
        });

        return NextResponse.json(healthData || {});
    } catch (error) {
        console.error("Error fetching health data:", error);
        return NextResponse.json(
            { error: "Failed to fetch health data" },
            { status: 500 }
        );
    }
}

// POST - Create or update health data
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const healthData = await req.json();

        // Validate input
        if (!healthData) {
            return NextResponse.json(
                { error: "Health data is required" },
                { status: 400 }
            );
        }

        // Create or update health data
        const result = await prisma.healthData.upsert({
            where: { userId },
            update: {
                age: healthData.age,
                weight: healthData.weight,
                height: healthData.height,
                allergies: healthData.allergies,
                conditions: healthData.conditions,
                goals: healthData.goals,
            },
            create: {
                userId,
                age: healthData.age,
                weight: healthData.weight,
                height: healthData.height,
                allergies: healthData.allergies,
                conditions: healthData.conditions,
                goals: healthData.goals,
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating health data:", error);
        return NextResponse.json(
            { error: "Failed to update health data" },
            { status: 500 }
        );
    }
} 