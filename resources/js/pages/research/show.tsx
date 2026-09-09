import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, UserPlus, Users as UsersIcon, Calendar, DollarSign, BookOpen, UserCheck, ShieldAlert, Award } from 'lucide-react';
import { useState } from 'react';
import { index as researchIndex } from '@/actions/App/Http/Controllers/Academic/ResearchController';
import {
    store as memberStore,
    destroy as memberDestroy,
} from '@/actions/App/Http/Controllers/Academic/ResearchMemberController';
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
import type { Auth, Research, User } from '@/types';

interface PageProps {
    auth: Auth;
    research: Research;
    users: User[];
}

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
return 'N/A';
}

    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) {
return 'N/A';
}

    return new Intl.NumberFormat('en-US', {
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
        if (confirm('Are you sure you want to remove this member from the research project?')) {
            router.delete(memberDestroy.url(memberId));
        }
    };

    const mayManage = auth.roles.includes('super-admin') || auth.permissions.includes('research.manage');

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Research: ${research.title}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/research">
                        <Button variant="outline" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-xl truncate" title={research.title}>
                            {research.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Academic Research Project Details
                        </p>
                    </div>
                </div>
                <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border
                        ${research.status === 'proposed' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/35 dark:text-amber-400 dark:border-amber-900' : ''}
                        ${research.status === 'ongoing' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/35 dark:text-indigo-400 dark:border-indigo-900' : ''}
                        ${research.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/35 dark:text-emerald-400 dark:border-emerald-900' : ''}
                    `}>
                        {research.status}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Research Information */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border dark:border-zinc-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                <BookOpen className="size-5 text-primary" />
                                Project Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div>
                                <span className="text-sm font-semibold text-muted-foreground block mb-1">Description</span>
                                <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-sm bg-zinc-50/50 dark:bg-zinc-900/30 p-3 rounded-lg border dark:border-zinc-800">
                                    {research.description || 'No description provided for this research project.'}
                                </p>
                            </div>
                            <Separator className="dark:bg-zinc-800" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between items-center py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">Start Date</span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-zinc-400" />
                                        {formatDate(research.start_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">End Date</span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-zinc-400" />
                                        {formatDate(research.end_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">Funding Source</span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                        {research.funding_source || 'Unspecified'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1.5">
                                    <span className="text-sm font-medium text-muted-foreground">Allocated Budget</span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-0.5">
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
                    <Card className="border dark:border-zinc-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <UsersIcon className="size-5 text-primary" /> Members
                            </CardTitle>
                            {mayManage && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsAddingMember(true)}
                                    className="cursor-pointer h-8 w-8"
                                    title="Add Member"
                                >
                                    <UserPlus className="h-4.5 w-4.5" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {research.research_members && research.research_members.length > 0 ? (
                                    research.research_members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between gap-3 p-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg border dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                                                    <UserCheck className="h-4 w-4" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                                                        {member.user?.name || 'Unknown User'}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {member.role || 'Member'}
                                                    </p>
                                                </div>
                                            </div>
                                            {mayManage && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    title="Remove Member"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg dark:border-zinc-800">
                                        No active members registered in this project.
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
                        <DialogTitle>Add Research Member</DialogTitle>
                        <DialogDescription>
                            Select a user and specify their role to add them to this research project.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="user_id">User</Label>
                                <Select
                                    value={memberForm.data.user_id}
                                    onValueChange={(val) => memberForm.setData('user_id', val)}
                                >
                                    <SelectTrigger id="user_id">
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {memberForm.errors.user_id && (
                                    <p className="text-xs text-destructive font-medium">{memberForm.errors.user_id}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    value={memberForm.data.role}
                                    onChange={(e) => memberForm.setData('role', e.target.value)}
                                    placeholder="e.g. Lead Researcher, Assistant"
                                />
                                {memberForm.errors.role && (
                                    <p className="text-xs text-destructive font-medium">{memberForm.errors.role}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddingMember(false)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={memberForm.processing} className="cursor-pointer">
                                Add Member
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
        { title: 'Research', href: '/research' },
        { title: 'Project Details', href: '#' },
    ],
};
