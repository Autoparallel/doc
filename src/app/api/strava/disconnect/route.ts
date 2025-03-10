import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
    try {
        // Get the authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the user ID from the session
        const userId = session.user.id;

        // Get the user from the database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                stravaConnected: true,
                stravaToken: true,
            },
        });

        if (!user || !user.stravaConnected) {
            return NextResponse.json(
                { error: "Strava not connected" },
                { status: 400 }
            );
        }

        // Optionally revoke the token with Strava
        if (user.stravaToken) {
            try {
                await fetch(`https://www.strava.com/oauth/deauthorize`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        access_token: user.stravaToken,
                    }),
                });
            } catch (error) {
                console.error("Error revoking Strava token:", error);
                // Continue with disconnection even if token revocation fails
            }
        }

        // Update the user record to remove Strava connection
        await prisma.user.update({
            where: { id: userId },
            data: {
                stravaConnected: false,
                stravaId: null,
                stravaToken: null,
                stravaRefreshToken: null,
                stravaTokenExpiresAt: null,
                stravaLastSync: null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error disconnecting Strava:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 