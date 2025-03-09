// This is a placeholder file until we properly install Prisma
// After running `npm install @prisma/client`, this file will work correctly

// Mock database for testing (will be replaced by real DB later)
const mockUsers = [
    {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        // Password: "password123"
        password: '$2b$10$DmX6QcR.YNLFqN.Tl3CxteVnHMFfd2YS2DfMDx8AxJxVT7WTmjdWO',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

const mockHealthData = [
    {
        id: '1',
        userId: '1',
        age: 35,
        weight: 75.5, // kg
        height: 175, // cm
        allergies: 'Peanuts, Shellfish',
        conditions: 'High cholesterol',
        goals: 'Weight management, Reduce cholesterol',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

const mockRecipes = [
    {
        id: '1',
        userId: '1',
        title: 'Heart-Healthy Mediterranean Salad',
        description: 'A delicious Mediterranean-inspired salad with olive oil, vegetables, and lean protein to support heart health.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170',
        prepTime: '15 mins',
        cookTime: '0 mins',
        calories: 320,
        protein: '15g',
        carbs: '25g',
        fats: '18g',
        tags: 'heart-healthy,low-cholesterol,high-fiber',
        benefits: 'Supports cardiovascular health,Provides healthy fats,Rich in antioxidants',
        ingredients: 'Mixed greens,Cherry tomatoes,Cucumber,Red onion,Kalamata olives,Feta cheese,Grilled chicken breast,Extra virgin olive oil,Lemon juice,Oregano',
        instructions: 'Chop all vegetables,Mix ingredients in a large bowl,Drizzle with olive oil and lemon juice,Season with oregano and black pepper,Toss gently and serve',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        userId: '1',
        title: 'Cholesterol-Lowering Oatmeal Bowl',
        description: 'A hearty breakfast bowl with oats, berries, and nuts designed to help lower cholesterol levels.',
        image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1074',
        prepTime: '5 mins',
        cookTime: '10 mins',
        calories: 380,
        protein: '12g',
        carbs: '52g',
        fats: '14g',
        tags: 'heart-healthy,breakfast,low-cholesterol',
        benefits: 'Helps lower LDL cholesterol,High in soluble fiber,Rich in antioxidants',
        ingredients: 'Rolled oats,Almond milk,Ground flaxseed,Chia seeds,Mixed berries,Sliced banana,Chopped walnuts,Cinnamon,Honey',
        instructions: 'Cook oats with almond milk according to package directions,Stir in flaxseed and chia seeds,Top with berries, banana, and walnuts,Sprinkle with cinnamon and drizzle with honey,Enjoy while warm',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

// Create a mock Prisma client with basic functionality
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma: any = {
    user: {
        findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
            if (where.email) {
                return mockUsers.find(user => user.email === where.email) || null;
            }
            if (where.id) {
                return mockUsers.find(user => user.id === where.id) || null;
            }
            return null;
        },
        create: async ({ data }: { data: any }) => {
            const newUser = {
                id: String(mockUsers.length + 1),
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockUsers.push(newUser);
            return newUser;
        }
    },
    healthData: {
        findUnique: async ({ where }: { where: { userId: string } }) => {
            return mockHealthData.find(data => data.userId === where.userId) || null;
        },
        upsert: async ({ where, create, update }: { where: { userId: string }, create: any, update: any }) => {
            const existingData = mockHealthData.find(data => data.userId === where.userId);
            if (existingData) {
                Object.assign(existingData, update, { updatedAt: new Date() });
                return existingData;
            } else {
                const newData = {
                    id: String(mockHealthData.length + 1),
                    ...create,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                mockHealthData.push(newData);
                return newData;
            }
        }
    },
    recipe: {
        findMany: async ({ where }: { where?: { userId: string } } = {}) => {
            // If where is provided, filter by userId; otherwise, return all recipes
            if (where && where.userId) {
                return mockRecipes.filter(recipe => recipe.userId === where.userId);
            }
            return mockRecipes;
        },
        create: async ({ data }: { data: any }) => {
            const newRecipe = {
                id: String(mockRecipes.length + 1),
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockRecipes.push(newRecipe);
            return newRecipe;
        }
    }
};

// This will be used after proper installation
declare global {
    // eslint-disable-next-line no-var
    var prisma: typeof mockPrisma | undefined;
}

export const prisma = global.prisma || mockPrisma;

// Set the global for development
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
} 