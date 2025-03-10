import { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Extend the built-in session types
     */
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            stravaConnected?: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        stravaConnected?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string;
        stravaAccessToken?: string;
        stravaRefreshToken?: string;
        stravaExpiresAt?: number;
    }
} 