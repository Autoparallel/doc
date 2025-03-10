import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        // Get the authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the user ID from the session
        const userId = session.user.id;

        // Get the user from the database with Strava tokens
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                stravaConnected: true,
                stravaToken: true,
                stravaRefreshToken: true,
                stravaTokenExpiresAt: true,
            },
        });

        if (!user || !user.stravaConnected) {
            return NextResponse.json(
                { error: "Strava not connected" },
                { status: 400 }
            );
        }

        // Check if token is expired and refresh if needed
        let accessToken = user.stravaToken;
        const now = new Date();
        const tokenExpiresAt = user.stravaTokenExpiresAt;

        if (tokenExpiresAt && tokenExpiresAt < now && user.stravaRefreshToken) {
            // Token is expired, refresh it
            const refreshedTokens = await refreshStravaToken(user.stravaRefreshToken);
            accessToken = refreshedTokens.access_token;

            // Update the user's tokens in the database
            await prisma.user.update({
                where: { id: userId },
                data: {
                    stravaToken: refreshedTokens.access_token,
                    stravaRefreshToken: refreshedTokens.refresh_token,
                    stravaTokenExpiresAt: new Date(refreshedTokens.expires_at * 1000),
                },
            });
        }

        if (!accessToken) {
            return NextResponse.json(
                { error: "Strava token not available" },
                { status: 400 }
            );
        }

        // Fetch activities from Strava API
        const activitiesResponse = await fetch(
            "https://www.strava.com/api/v3/athlete/activities?per_page=10",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!activitiesResponse.ok) {
            return NextResponse.json(
                { error: "Failed to fetch activities from Strava" },
                { status: 400 }
            );
        }

        const activities = await activitiesResponse.json();

        return NextResponse.json({ activities });
    } catch (error) {
        console.error("Error fetching Strava activities:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

async function refreshStravaToken(refreshToken: string) {
    const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh Strava token");
    }

    return await response.json();
} 