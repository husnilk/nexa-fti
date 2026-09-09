export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Permission = {
    uuid: string;
    id: string;
    name: string;
    guard_name: string;
    category?: string | null;
    description?: string | null;
    created_at: string;
};

export type Auth = {
    user: User;
    roles: string[];
    permissions: string[];
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */
