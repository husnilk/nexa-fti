import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Trash2,
    UserPlus,
    Users as UsersIcon,
    Briefcase,
    Info,
} from 'lucide-react';
import { useState } from 'react';
import { index as serviceIndex } from '@/actions/App/Http/Controllers/Academic/CommunityServiceController';
import {
    store as memberStore,
    destroy as memberDestroy,
} from '@/actions/App/Http/Controllers/Academic/CommunityServiceMemberController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { __, intlLocale } from '@/lib/i18n';
import type { Auth, CommunityService, User } from '@/types';

interface PageProps {
    auth: Auth;
    communityService: CommunityService;
    users: User[];
}

const statusColors: Record<string, string> = {
    proposed:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400',
    ongoing:
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400',
    completed:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400',
};

const statusLabels: Record<string, string> = {
    proposed: __('Proposed'),
    ongoing: __('Ongoing'),
    completed: __('Completed'),
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
});

export default function CommunityServiceShow({
    communityService,
    users,
}: PageProps) {
    const [isAddingMember, setIsAddingMember] = useState(false);

    const memberForm = useForm({
        community_service_id: communityService?.id || '',
        user_id: '',
        role: '',
    });

    if (!communityService) {
        return null;
    }

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        memberForm.post(memberStore.url(), {
            onSuccess: () => {
                setIsAddingMember(false);
                memberForm.reset('user_id', 'role');
            },
        });
    };

    const handleRemoveMember = (memberId: string) => {
        if (confirm(__('Are you sure you want to remove this member?'))) {
            router.delete(memberDestroy.url(memberId));
        }
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Community Service: :title', {
                    title: communityService.title,
                })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href={serviceIndex().url}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {communityService.title}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Project ID: :id...', {
                                id: communityService.id.substring(0, 8),
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`px-3 py-1 text-sm font-semibold capitalize ${statusColors[communityService.status]}`}
                    >
                        {statusLabels[communityService.status] ??
                            communityService.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="size-5 text-primary" />
                            {__('Project Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {__('Description')}
                            </Label>
                            <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                                {communityService.description ||
                                    __('No description provided.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Location')}
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    <MapPin className="size-4 text-muted-foreground" />
                                    {communityService.location}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Funding Source')}
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Briefcase className="size-4 text-muted-foreground" />
                                    {communityService.funding_source || '-'}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Time Period')}
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    {dateFormatter.format(
                                        new Date(communityService.start_date),
                                    )}
                                    {communityService.end_date && (
                                        <>
                                            {' - '}
                                            {dateFormatter.format(
                                                new Date(
                                                    communityService.end_date,
                                                ),
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <UsersIcon className="size-4 text-primary" />
                            {__('Team Members')}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsAddingMember(true)}
                            title={__('Add Member')}
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                        >
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {communityService.community_service_members?.map(
                                (member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400">
                                                {member.user?.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .substring(0, 2)}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {member.user?.name}
                                                </p>
                                                <p className="truncate text-xs font-medium text-muted-foreground">
                                                    {member.role ||
                                                        __('Member')}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                            onClick={() =>
                                                handleRemoveMember(member.id)
                                            }
                                            title={__('Remove Member')}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ),
                            )}
                            {communityService.community_service_members
                                ?.length === 0 && (
                                <div className="space-y-2 py-10 text-center">
                                    <UsersIcon className="mx-auto h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {__('No team members added yet.')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Member Dialog */}
            <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Add Team Member')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Select a user to add to this community service project.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="user_id">{__('User')}</Label>
                                <Select
                                    value={memberForm.data.user_id}
                                    onValueChange={(val) =>
                                        memberForm.setData('user_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={__('Select a user')}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">{__('Role')}</Label>
                                <Input
                                    id="role"
                                    placeholder={__(
                                        'e.g. Project Lead, Volunteer',
                                    )}
                                    value={memberForm.data.role}
                                    onChange={(e) =>
                                        memberForm.setData(
                                            'role',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddingMember(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={memberForm.processing}
                            >
                                {__('Add Member')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CommunityServiceShow.layout = {
    breadcrumbs: [
        {
            title: __('Community Service'),
            href: serviceIndex(),
        },
        {
            title: __('Detail'),
            href: '#',
        },
    ],
};
