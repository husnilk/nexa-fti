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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
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
        if (confirm('Are you sure you want to remove this member?')) {
            router.delete(memberDestroy.url(memberId));
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Community Service: ${communityService.title}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
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
                        <p className="text-muted-foreground mt-1">
                            Project ID: {communityService.id.substring(0, 8)}...
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`capitalize font-semibold py-1 px-3 text-sm ${statusColors[communityService.status]}`}
                    >
                        {communityService.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="size-5 text-primary" />
                            Project Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Description
                            </Label>
                            <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                                {communityService.description ||
                                    'No description provided.'}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Location
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    <MapPin className="size-4 text-muted-foreground" />
                                    {communityService.location}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Funding Source
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Briefcase className="size-4 text-muted-foreground" />
                                    {communityService.funding_source || '-'}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Time Period
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
                            Team Members
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsAddingMember(true)}
                            title="Add Member"
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
                                        className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400 font-semibold text-xs">
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
                                                <p className="truncate text-xs text-muted-foreground font-medium">
                                                    {member.role || 'Member'}
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
                                            title="Remove Member"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ),
                            )}
                            {communityService.community_service_members
                                ?.length === 0 && (
                                <div className="py-10 text-center space-y-2">
                                    <UsersIcon className="h-10 w-10 mx-auto text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground font-medium">
                                        No team members added yet.
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
                        <DialogTitle>Add Team Member</DialogTitle>
                        <DialogDescription>
                            Select a user to add to this community service
                            project.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="user_id">User</Label>
                                <Select
                                    value={memberForm.data.user_id}
                                    onValueChange={(val) =>
                                        memberForm.setData('user_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user" />
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
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    placeholder="e.g. Project Lead, Volunteer"
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
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={memberForm.processing}
                            >
                                Add Member
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
            title: 'Community Service',
            href: serviceIndex(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
