import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Get all recipes for the current user
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

        const recipes = await prisma.recipe.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return NextResponse.json(
            { error: "Failed to fetch recipes" },
            { status: 500 }
        );
    }
}

// POST - Save a new recipe
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
        const recipeData = await req.json();

        // Validate input
        if (!recipeData || !recipeData.title || !recipeData.description) {
            return NextResponse.json(
                { error: "Recipe title and description are required" },
                { status: 400 }
            );
        }

        // Process arrays to store as strings
        const tags = Array.isArray(recipeData.tags)
            ? recipeData.tags.join(",")
            : recipeData.tags;
        const benefits = Array.isArray(recipeData.benefits)
            ? recipeData.benefits.join(",")
            : recipeData.benefits;
        const ingredients = Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients.join(",")
            : recipeData.ingredients;
        const instructions = Array.isArray(recipeData.instructions)
            ? recipeData.instructions.join(",")
            : recipeData.instructions;

        // Create recipe
        const recipe = await prisma.recipe.create({
            data: {
                userId,
                title: recipeData.title,
                description: recipeData.description,
                image: recipeData.image,
                prepTime: recipeData.prepTime,
                cookTime: recipeData.cookTime,
                calories: recipeData.calories,
                protein: recipeData.protein,
                carbs: recipeData.carbs,
                fats: recipeData.fats,
                tags,
                benefits,
                ingredients,
                instructions,
            },
        });

        return NextResponse.json(recipe, { status: 201 });
    } catch (error) {
        console.error("Error creating recipe:", error);
        return NextResponse.json(
            { error: "Failed to create recipe" },
            { status: 500 }
        );
    }
} 