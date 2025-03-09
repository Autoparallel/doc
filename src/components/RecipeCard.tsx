import React from 'react';
import { Recipe } from '@/lib/llm';

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
                {/* Use a div with background image instead of Next.js Image component */}
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${imgSrc})` }}
                />
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {recipe.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {recipe.description}
                </p>

                {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            >
                                {typeof tag === 'string'
                                    ? tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                    : tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {recipe.prepTime && <div>Prep: {recipe.prepTime}</div>}
                    {recipe.cookTime && <div>Cook: {recipe.cookTime}</div>}
                    {recipe.calories && <div>{recipe.calories} cal</div>}
                </div>

                <div className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Health Benefits:</h4>
                    {recipe.benefits && recipe.benefits.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            {recipe.benefits.map((benefit, index) => (
                                <li key={index} className="text-sm">{benefit}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Benefits not specified</p>
                    )}
                </div>
            </div>
        </div>
    );
} 