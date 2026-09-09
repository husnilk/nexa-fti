import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index as usersIndex } from '@/routes/users';
import type { Auth, User } from '@/types';

type Role = {
    id: number;
    name: string;
};

type UserWithRoles = User & {
    roles: Role[];
};

type PageProps = {
    auth: Auth;
    user: UserWithRoles;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
});

export default function UserShow({ user }: PageProps) {
    return (
        <>
            <Head title={`User: ${user.name}`} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                    <Link href={usersIndex()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {user.name}
                            </h1>
                            <Badge
                                variant={user.is_active ? 'default' : 'secondary'}
                                className="rounded-full px-3 py-1 uppercase"
                            >
                                {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            User details, role assignments, and account status.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="border-b pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                                General Information
                            </h3>
                            <div className="grid gap-4 mt-4">
                                <div className="grid grid-cols-3 border-b pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        ID
                                    </span>
                                    <span
                                        className="col-span-2 truncate font-mono text-sm"
                                        title={user.id}
                                    >
                                        {user.id}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 border-b pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </span>
                                    <span className="col-span-2 text-sm text-zinc-900 dark:text-zinc-50">
                                        {user.name}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 border-b pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </span>
                                    <span className="col-span-2 text-sm text-zinc-900 dark:text-zinc-50">
                                        {user.email}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 border-b pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Joined
                                    </span>
                                    <span className="col-span-2 text-sm text-zinc-900 dark:text-zinc-50">
                                        {dateFormatter.format(
                                            new Date(user.created_at),
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-3">
                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="border-b pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                                Roles & Access
                            </h3>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <Badge
                                            key={role.id}
                                            variant="secondary"
                                            className="text-sm"
                                        >
                                            {role.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        No roles assigned.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

UserShow.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: usersIndex(),
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
