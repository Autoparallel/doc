'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            // Set refresh interval to 5 minutes (300 seconds) to reduce API calls
            // Default is 1 minute which causes frequent /api/auth/session requests
            refetchInterval={300}
            refetchOnWindowFocus={false}
        >
            {children}
        </SessionProvider>
    );
} 