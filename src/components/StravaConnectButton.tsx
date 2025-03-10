"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

type StravaActivity = {
    id: string;
    name: string;
    distance: number;
    moving_time: number;
    start_date: string;
    type: string;
};

interface SessionUser {
    id: string;
    name?: string;
    email?: string;
    stravaConnected?: boolean;
}

export default function StravaConnectButton() {
    const { data: session, status, update } = useSession();
    const [activities, setActivities] = useState<StravaActivity[]>([]);
    const [loading, setLoading] = useState(false);

    // Check if the user has connected their Strava account
    const isConnected = session?.user && (session.user as SessionUser).stravaConnected;

    // Fetch Strava activities when connected
    useEffect(() => {
        if (isConnected) {
            fetchStravaActivities();
        }
    }, [isConnected]);

    const connectStrava = async () => {
        await signIn("strava", { callbackUrl: "/dashboard" });
    };

    const disconnectStrava = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/strava/disconnect", {
                method: "POST",
            });

            if (response.ok) {
                // Refresh the session
                await update();
                setActivities([]);
            } else {
                console.error("Failed to disconnect Strava");
            }
        } catch (error) {
            console.error("Error disconnecting Strava:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStravaActivities = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/strava/activities");
            if (response.ok) {
                const data = await response.json();
                setActivities(data.activities);
            } else {
                console.error("Failed to fetch Strava activities");
            }
        } catch (error) {
            console.error("Error fetching Strava activities:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDistance = (meters: number) => {
        const kilometers = meters / 1000;
        return `${kilometers.toFixed(2)} km`;
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Image
                        src="/strava-logo.png"
                        alt="Strava"
                        width={30}
                        height={30}
                        className="mr-2"
                    />
                    Strava Integration
                </CardTitle>
                <CardDescription>
                    Connect your Strava account to track your fitness activities
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isConnected ? (
                    <div>
                        <p className="text-green-600 mb-4">✓ Your Strava account is connected</p>
                        {activities.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Recent Activities</h3>
                                <div className="space-y-2">
                                    {activities.slice(0, 3).map((activity) => (
                                        <div key={activity.id} className="p-3 bg-slate-100 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">{activity.name}</h4>
                                                    <p className="text-sm text-slate-600">
                                                        {new Date(activity.start_date).toLocaleDateString()} • {activity.type}
                                                    </p>
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p>{formatDistance(activity.distance)}</p>
                                                    <p>{formatTime(activity.moving_time)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {activities.length > 3 && (
                                    <p className="text-sm text-center text-slate-500">
                                        + {activities.length - 3} more activities
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-slate-500">No recent activities found</p>
                        )}
                    </div>
                ) : (
                    <p className="mb-4">
                        Connect your Strava account to import your fitness activities and get personalized recipe recommendations based on your workouts.
                    </p>
                )}
            </CardContent>
            <CardFooter>
                {isConnected ? (
                    <div className="flex space-x-2 w-full">
                        <Button
                            variant="outline"
                            onClick={fetchStravaActivities}
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Loading..." : "Refresh Activities"}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={disconnectStrava}
                            disabled={loading}
                            className="flex-1"
                        >
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={connectStrava}
                        disabled={loading}
                        className="w-full bg-[#FC4C02] hover:bg-[#e34500]"
                    >
                        {loading ? "Loading..." : "Connect to Strava"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
} 