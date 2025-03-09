import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface Recipe {
    id: string;
    userId: string;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        // Get the session
        const session = await getServerSession(authOptions);

        // Check if user is authenticated
        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // We need to await the params object before accessing its properties
        const { id } = await context.params;
        const recipeId = id;

        try {
            // For mock DB, search through all recipes
            const allRecipes = await prisma.recipe.findMany({});
            const recipe = allRecipes.find((r: Recipe) => r.id === recipeId);

            if (!recipe) {
                return NextResponse.json(
                    { error: "Recipe not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(recipe);
        } catch (error) {
            console.error("Error fetching recipe:", error);
            return NextResponse.json(
                { error: "Failed to fetch recipe" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in recipe route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 