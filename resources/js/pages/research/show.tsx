import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Trash2,
    UserPlus,
    Users as UsersIcon,
    Calendar,
    DollarSign,
    BookOpen,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import {
    store as memberStore,
    destroy as memberDestroy,
} from '@/actions/App/Http/Controllers/Academic/ResearchMemberController';
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
import type { Auth, Research, User } from '@/types';

interface PageProps {
    auth: Auth;
    research: Research;
    users: User[];
}

const STATUS_LABELS: Record<string, string> = {
    proposed: __('Proposed'),
    ongoing: __('Ongoing'),
    completed: __('Completed'),
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
        return __('N/A');
    }

    return new Date(dateString).toLocaleDateString(intlLocale(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) {
        return __('N/A');
    }

    return new Intl.NumberFormat(intlLocale(), {
        style: 'currency',
        currency: 'USD',
    }).format(Number(amount));
};

export default function ResearchShow({ research, users = [] }: PageProps) {
    if (!research) {
        return null;
    }

    const { auth } = usePage<PageProps>().props;
    const [isAddingMember, setIsAddingMember] = useState(false);

    const memberForm = useForm({
        research_id: research.id,
        user_id: '',
        role: '',
    });

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
        if (
            confirm(
                __(
                    'Are you sure you want to remove this member from the research project?',
                ),
            )
        ) {
            router.delete(memberDestroy.url(memberId));
        }
    };

    const mayManage =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('research.manage');

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Research: :title', { title: research.title })} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href="/research">
                        <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1
                            className="max-w-xl truncate text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                            title={research.title}
                        >
                            {research.title}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Academic Research Project Details')}
                        </p>
                    </div>
                </div>
                <div>
                    <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${research.status === 'proposed' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-400' : ''} ${research.status === 'ongoing' ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${research.status === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} `}
                    >
                        {STATUS_LABELS[research.status] ?? research.status}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Research Information */}
                <div className="space-y-6 md:col-span-2">
                    <Card className="border shadow-sm dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                <BookOpen className="size-5 text-primary" />
                                {__('Project Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div>
                                <span className="mb-1 block text-sm font-semibold text-muted-foreground">
                                    {__('Description')}
                                </span>
                                <p className="rounded-lg border bg-zinc-50/50 p-3 text-sm leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                                    {research.description ||
                                        __(
                                            'No description provided for this research project.',
                                        )}
                                </p>
                            </div>
                            <Separator className="dark:bg-zinc-800" />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex items-center justify-between py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Start Date')}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                        <Calendar className="h-4 w-4 text-zinc-400" />
                                        {formatDate(research.start_date)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('End Date')}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                        <Calendar className="h-4 w-4 text-zinc-400" />
                                        {formatDate(research.end_date)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Funding Source')}
                                    </span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                        {research.funding_source ||
                                            __('Unspecified')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Allocated Budget')}
                                    </span>
                                    <span className="flex items-center gap-0.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                        <DollarSign className="h-4 w-4 text-zinc-400" />
                                        {formatCurrency(research.budget)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Research Members */}
                <div className="space-y-6">
                    <Card className="border shadow-sm dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <UsersIcon className="size-5 text-primary" />{' '}
                                {__('Members')}
                            </CardTitle>
                            {mayManage && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsAddingMember(true)}
                                    className="h-8 w-8 cursor-pointer"
                                    title={__('Add Member')}
                                >
                                    <UserPlus className="h-4.5 w-4.5" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {research.research_members &&
                                research.research_members.length > 0 ? (
                                    research.research_members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60"
                                        >
                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                    <UserCheck className="h-4 w-4" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                                                        {member.user?.name ||
                                                            __('Unknown User')}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {member.role ||
                                                            __('Member')}
                                                    </p>
                                                </div>
                                            </div>
                                            {mayManage && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member.id,
                                                        )
                                                    }
                                                    title={__('Remove Member')}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground dark:border-zinc-800">
                                        {__(
                                            'No active members registered in this project.',
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Member Dialog */}
            <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{__('Add Research Member')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Select a user and specify their role to add them to this research project.',
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
                                    <SelectTrigger id="user_id">
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
                                {memberForm.errors.user_id && (
                                    <p className="text-xs font-medium text-destructive">
                                        {memberForm.errors.user_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">{__('Role')}</Label>
                                <Input
                                    id="role"
                                    value={memberForm.data.role}
                                    onChange={(e) =>
                                        memberForm.setData(
                                            'role',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'e.g. Lead Researcher, Assistant',
                                    )}
                                />
                                {memberForm.errors.role && (
                                    <p className="text-xs font-medium text-destructive">
                                        {memberForm.errors.role}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddingMember(false)}
                                className="cursor-pointer"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={memberForm.processing}
                                className="cursor-pointer"
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

ResearchShow.layout = {
    breadcrumbs: [
        { title: __('Research'), href: '/research' },
        { title: __('Project Details'), href: '#' },
    ],
};
