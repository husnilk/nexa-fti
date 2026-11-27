import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { router } from '@inertiajs/react';
import { Check, ChevronsUpDown, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { loginAs } from '@/routes';

export type QuickLoginUser = {
    id: string | number;
    name: string;
    email: string;
};

export default function QuickLogin({ users }: { users: QuickLoginUser[] }) {
    const [selectedUser, setSelectedUser] = useState<QuickLoginUser | null>(
        null,
    );
    const [query, setQuery] = useState('');
    const [processing, setProcessing] = useState(false);

    const normalizedQuery = query.trim().toLowerCase();
    const filteredUsers =
        normalizedQuery === ''
            ? users
            : users.filter(
                  (user) =>
                      user.name.toLowerCase().includes(normalizedQuery) ||
                      user.email.toLowerCase().includes(normalizedQuery),
              );

    const handleQuickLogin = () => {
        if (!selectedUser || processing) {
            return;
        }

        router.post(
            loginAs.url({ user: selectedUser.id }),
            {},
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="grid gap-3 rounded-lg border border-dashed border-amber-500/60 bg-amber-50/50 p-4 dark:bg-amber-950/20">
            <div className="flex items-center gap-2">
                <Zap className="size-4 text-amber-600" />
                <Label htmlFor="quick-login-user">Quick login</Label>
                <span className="ml-auto rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                    Dev only
                </span>
            </div>

            <Combobox
                value={selectedUser}
                onChange={setSelectedUser}
                onClose={() => setQuery('')}
                immediate
            >
                <div className="relative">
                    <ComboboxInput
                        id="quick-login-user"
                        className="flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 pr-9 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                        displayValue={(user: QuickLoginUser | null) =>
                            user ? `${user.name} (${user.email})` : ''
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search user by name or email"
                        autoComplete="off"
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground">
                        <ChevronsUpDown className="size-4" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom start"
                    className="z-50 max-h-60 w-(--input-width) overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md [--anchor-gap:4px] empty:invisible"
                >
                    {filteredUsers.length === 0 && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No users found.
                        </div>
                    )}
                    {filteredUsers.map((user) => (
                        <ComboboxOption
                            key={user.id}
                            value={user}
                            className="group flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none data-focus:bg-accent data-focus:text-accent-foreground"
                        >
                            <Check className="invisible size-4 group-data-selected:visible" />
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleQuickLogin}
                disabled={!selectedUser || processing}
                data-test="quick-login-button"
            >
                {processing && <Spinner />}
                Quick login
            </Button>
        </div>
    );
}
