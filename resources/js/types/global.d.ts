import type { Auth } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            app_debug: boolean;
            debug_users: { id: string; name: string; email: string }[];
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

declare global {
    function route(name?: string, params?: any, absolute?: boolean, config?: any): string;
}

