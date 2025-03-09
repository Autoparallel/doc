import React from 'react';
import { Recipe } from '@/lib/llm';
import Link from 'next/link';

// Fixed, static fallback image URL that we know works with Next.js
const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    // Use a React state to handle image loading errors
    const [imgSrc] = React.useState<string>(() => {
        // Only use the recipe image if it's a valid URL
        if (recipe.image &&
            (recipe.image.startsWith('http://') || recipe.image.startsWith('https://'))) {
            return recipe.image;
        }
        return FALLBACK_IMAGE_URL;
    });

    return (
        <div className="card">
            {imgSrc && (
                <div className="relative h-48 w-full mb-4 -mt-4 -mx-4 rounded-t-lg overflow-hidden">
                    <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${imgSrc})` }}
                    />
                </div>
            )}

            <h3 className="text-xl font-semibold text-white mb-2">
                {recipe.title}
            </h3>

            <p className="text-muted mb-4 line-clamp-3">
                {recipe.description}
            </p>

            {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="badge badge-accent"
                        >
                            {typeof tag === 'string'
                                ? tag.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                : tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center text-sm text-muted mb-4">
                {recipe.prepTime && <div>Prep: {recipe.prepTime}</div>}
                {recipe.cookTime && <div>Cook: {recipe.cookTime}</div>}
                {recipe.calories && <div>{recipe.calories} cal</div>}
            </div>

            <Link
                href={`/recipes/${recipe.id}`}
                className="btn btn-primary inline-block"
            >
                View Recipe
            </Link>
        </div>
    );
} 