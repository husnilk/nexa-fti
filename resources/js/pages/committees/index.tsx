import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    Eye,
    Shield,
    Users,
    Calendar,
    DollarSign,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    Save,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { __ } from '@/lib/i18n';
import { store, update, destroy, show } from '@/routes/committees';
import type { Auth } from '@/types';

type Employee = {
    id: string;
    name: string;
};

type Organization = {
    id: string;
    name: string;
};

type Committee = {
    id: string;
    code: string;
    name: string;
    objective: string;
    expected_outcome: string;
    start_date: string;
    end_date: string;
    status: 'draft' | 'active' | 'inactive' | 'completed';
    chairman_id: string;
    organization_id: string;
    description: string;
    chairman?: Employee;
    organization?: Organization;
};

type PageProps = {
    auth: Auth;
    committees: Committee[];
    employees: Employee[];
    organizations: Organization[];
};

export default function CommitteesIndex({
    committees = [],
    employees = [],
    organizations = [],
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCommittee, setEditingCommittee] = useState<Committee | null>(
        null,
    );
    const [deletingCommittee, setDeletingCommittee] =
        useState<Committee | null>(null);

    // Create Form
    const {
        data: createData,
        setData: setCreateData,
        post: postCreate,
        processing: creating,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        code: '',
        name: '',
        objective: '',
        expected_outcome: '',
        start_date: '',
        end_date: '',
        status: 'draft',
        chairman_id: '',
        organization_id: '',
        description: '',
    });

    // Edit Form
    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: updating,
        errors: editErrors,
        reset: resetEdit,
        clearErrors: clearEditErrors,
    } = useForm({
        code: '',
        name: '',
        objective: '',
        expected_outcome: '',
        start_date: '',
        end_date: '',
        status: 'draft',
        chairman_id: '',
        organization_id: '',
        description: '',
    });

    useEffect(() => {
        if (editingCommittee) {
            setEditData({
                code: editingCommittee.code,
                name: editingCommittee.name,
                objective: editingCommittee.objective || '',
                expected_outcome: editingCommittee.expected_outcome || '',
                start_date: editingCommittee.start_date || '',
                end_date: editingCommittee.end_date || '',
                status: editingCommittee.status,
                chairman_id: editingCommittee.chairman_id || '',
                organization_id: editingCommittee.organization_id || '',
                description: editingCommittee.description || '',
            });
            clearEditErrors();
        }
    }, [editingCommittee]);

    const handleCreateSubmit = (e: FormEvent) => {
        e.preventDefault();
        postCreate(store.url(), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            },
        });
    };

    const handleEditSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!editingCommittee) {
            return;
        }

        putEdit(update.url(editingCommittee.id), {
            onSuccess: () => {
                setEditingCommittee(null);
                resetEdit();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingCommittee) {
            return;
        }

        router.delete(destroy.url(deletingCommittee.id), {
            onSuccess: () => setDeletingCommittee(null),
        });
    };

    // Filter committees
    const filteredCommittees = committees.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            (c.objective &&
                c.objective.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === 'all' || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusLabels: Record<string, string> = {
        all: __('All'),
        draft: __('Draft'),
        active: __('Active'),
        inactive: __('Inactive'),
        completed: __('Completed'),
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {__('Active')}
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                        {__('Completed')}
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                        <Clock className="h-3.5 w-3.5" /> {__('Inactive')}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <AlertCircle className="h-3.5 w-3.5" /> {__('Draft')}
                    </span>
                );
        }
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Committees')} />

            <div className="flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Committees')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage institutional committees, members, tasks, and budgets.',
                        )}
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:from-violet-700 hover:to-indigo-700"
                >
                    <Plus className="mr-2 h-4.5 w-4.5" /> {__('New Committee')}
                </Button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col items-stretch justify-between gap-4 rounded-xl border bg-white p-4 shadow-xs md:flex-row md:items-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400" />
                    <Input
                        type="text"
                        placeholder={__('Search by code, name, objective...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-500">
                        {__('Status:')}
                    </span>
                    <div className="flex overflow-hidden rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        {[
                            'all',
                            'draft',
                            'active',
                            'inactive',
                            'completed',
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                                    statusFilter === status
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                                }`}
                            >
                                {statusLabels[status] ?? status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Committees Grid */}
            {filteredCommittees.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <Shield className="mb-4 h-16 w-16 animate-pulse text-zinc-300 dark:text-zinc-700" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {__('No Committees Found')}
                    </h3>
                    <p className="mt-1 max-w-md text-center text-sm text-zinc-500">
                        {__(
                            'Try adjusting your search query or status filter, or create a new committee to get started.',
                        )}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCommittees.map((committee) => (
                        <div
                            key={committee.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-300 hover:border-violet-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800"
                        >
                            <div className="space-y-4 p-6">
                                <div className="flex items-start justify-between">
                                    <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-bold tracking-wider text-violet-600 uppercase dark:bg-violet-950/40 dark:text-violet-400">
                                        {committee.code}
                                    </span>
                                    {getStatusBadge(committee.status)}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-zinc-900 transition-colors duration-200 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                                        {committee.name}
                                    </h3>
                                    {committee.organization && (
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Shield className="h-3.5 w-3.5" />{' '}
                                            {committee.organization.name}
                                        </p>
                                    )}
                                </div>

                                <p className="line-clamp-2 min-h-[40px] text-sm text-zinc-600 italic dark:text-zinc-400">
                                    "
                                    {committee.objective ||
                                        __('No objective specified.')}
                                    "
                                </p>

                                <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs text-zinc-500 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-zinc-400" />
                                        <div>
                                            <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                                                {__('Timeline')}
                                            </p>
                                            <p>
                                                {__(':start to :end', {
                                                    start:
                                                        committee.start_date ||
                                                        '-',
                                                    end:
                                                        committee.end_date ||
                                                        '-',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-zinc-400" />
                                        <div>
                                            <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                                                {__('Chairman')}
                                            </p>
                                            <p className="max-w-[100px] truncate">
                                                {committee.chairman?.name ||
                                                    __('Unassigned')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between gap-2 border-t bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
                                <Link
                                    href={show.url(committee.id)}
                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-violet-200/55 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800/40 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/40"
                                >
                                    <Eye className="h-4 w-4" />{' '}
                                    {__('View cockpit')}
                                </Link>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setEditingCommittee(committee)
                                    }
                                    className="border-zinc-200 text-zinc-600 hover:text-violet-600 dark:border-zinc-800 dark:text-zinc-400"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setDeletingCommittee(committee)
                                    }
                                    className="border-zinc-200 text-zinc-600 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Committee Modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={(open) => !open && setIsCreateModalOpen(false)}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{__('Create Committee')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-code">
                                    {__('Code *')}
                                </Label>
                                <Input
                                    id="create-code"
                                    value={createData.code}
                                    onChange={(e) =>
                                        setCreateData('code', e.target.value)
                                    }
                                    placeholder={__('e.g. CMT-01')}
                                    required
                                />
                                {createErrors.code && (
                                    <p className="text-sm text-destructive">
                                        {createErrors.code}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">
                                    {__('Name *')}
                                </Label>
                                <Input
                                    id="create-name"
                                    value={createData.name}
                                    onChange={(e) =>
                                        setCreateData('name', e.target.value)
                                    }
                                    placeholder={__('Committee Name')}
                                    required
                                />
                                {createErrors.name && (
                                    <p className="text-sm text-destructive">
                                        {createErrors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-objective">
                                {__('Objective')}
                            </Label>
                            <Textarea
                                id="create-objective"
                                value={createData.objective}
                                onChange={(e) =>
                                    setCreateData('objective', e.target.value)
                                }
                                placeholder={__(
                                    'What is the objective of this committee?',
                                )}
                                rows={2}
                            />
                            {createErrors.objective && (
                                <p className="text-sm text-destructive">
                                    {createErrors.objective}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-expected_outcome">
                                {__('Expected Outcome')}
                            </Label>
                            <Textarea
                                id="create-expected_outcome"
                                value={createData.expected_outcome}
                                onChange={(e) =>
                                    setCreateData(
                                        'expected_outcome',
                                        e.target.value,
                                    )
                                }
                                placeholder={__(
                                    'What are the expected outcomes?',
                                )}
                                rows={2}
                            />
                            {createErrors.expected_outcome && (
                                <p className="text-sm text-destructive">
                                    {createErrors.expected_outcome}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-start_date">
                                    {__('Start Date')}
                                </Label>
                                <Input
                                    id="create-start_date"
                                    type="date"
                                    value={createData.start_date}
                                    onChange={(e) =>
                                        setCreateData(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                {createErrors.start_date && (
                                    <p className="text-sm text-destructive">
                                        {createErrors.start_date}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-end_date">
                                    {__('End Date')}
                                </Label>
                                <Input
                                    id="create-end_date"
                                    type="date"
                                    value={createData.end_date}
                                    onChange={(e) =>
                                        setCreateData(
                                            'end_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                {createErrors.end_date && (
                                    <p className="text-sm text-destructive">
                                        {createErrors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-chairman">
                                    {__('Chairman')}
                                </Label>
                                <select
                                    id="create-chairman"
                                    value={createData.chairman_id}
                                    onChange={(e) =>
                                        setCreateData(
                                            'chairman_id',
                                            e.target.value,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">
                                        {__('Select Chairman')}
                                    </option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                                {createErrors.chairman_id && (
                                    <p className="text-sm text-destructive">
                                        {createErrors.chairman_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-organization">
                                    {__('Organization Unit')}
                                </Label>
                                <select
                                    id="create-organization"
                                    value={createData.organization_id}
                                    onChange={(e) =>
                                        setCreateData(
                                            'organization_id',
                                            e.target.value,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">
                                        {__('Select Organization Unit')}
                                    </option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                                {createErrors.organization_id && (
                                    <p className="text-sm text-destructive">
                                        {createErrors.organization_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-status">
                                    {__('Status *')}
                                </Label>
                                <select
                                    id="create-status"
                                    value={createData.status}
                                    onChange={(e) =>
                                        setCreateData(
                                            'status',
                                            e.target.value as any,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="draft">{__('Draft')}</option>
                                    <option value="active">
                                        {__('Active')}
                                    </option>
                                    <option value="inactive">
                                        {__('Inactive')}
                                    </option>
                                    <option value="completed">
                                        {__('Completed')}
                                    </option>
                                </select>
                                {createErrors.status && (
                                    <p className="text-sm text-destructive">
                                        {createErrors.status}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={creating}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs hover:from-violet-700 hover:to-indigo-700"
                            >
                                {__('Create Committee')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Committee Modal */}
            <Dialog
                open={editingCommittee !== null}
                onOpenChange={(open) => !open && setEditingCommittee(null)}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{__('Edit Committee')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-code">
                                    {__('Code *')}
                                </Label>
                                <Input
                                    id="edit-code"
                                    value={editData.code}
                                    onChange={(e) =>
                                        setEditData('code', e.target.value)
                                    }
                                    required
                                />
                                {editErrors.code && (
                                    <p className="text-sm text-destructive">
                                        {editErrors.code}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">
                                    {__('Name *')}
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData('name', e.target.value)
                                    }
                                    required
                                />
                                {editErrors.name && (
                                    <p className="text-sm text-destructive">
                                        {editErrors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-objective">
                                {__('Objective')}
                            </Label>
                            <Textarea
                                id="edit-objective"
                                value={editData.objective}
                                onChange={(e) =>
                                    setEditData('objective', e.target.value)
                                }
                                rows={2}
                            />
                            {editErrors.objective && (
                                <p className="text-sm text-destructive">
                                    {editErrors.objective}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-expected_outcome">
                                {__('Expected Outcome')}
                            </Label>
                            <Textarea
                                id="edit-expected_outcome"
                                value={editData.expected_outcome}
                                onChange={(e) =>
                                    setEditData(
                                        'expected_outcome',
                                        e.target.value,
                                    )
                                }
                                rows={2}
                            />
                            {editErrors.expected_outcome && (
                                <p className="text-sm text-destructive">
                                    {editErrors.expected_outcome}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-start_date">
                                    {__('Start Date')}
                                </Label>
                                <Input
                                    id="edit-start_date"
                                    type="date"
                                    value={editData.start_date}
                                    onChange={(e) =>
                                        setEditData(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editErrors.start_date && (
                                    <p className="text-sm text-destructive">
                                        {editErrors.start_date}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-end_date">
                                    {__('End Date')}
                                </Label>
                                <Input
                                    id="edit-end_date"
                                    type="date"
                                    value={editData.end_date}
                                    onChange={(e) =>
                                        setEditData('end_date', e.target.value)
                                    }
                                />
                                {editErrors.end_date && (
                                    <p className="text-sm text-destructive">
                                        {editErrors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-chairman">
                                    {__('Chairman')}
                                </Label>
                                <select
                                    id="edit-chairman"
                                    value={editData.chairman_id}
                                    onChange={(e) =>
                                        setEditData(
                                            'chairman_id',
                                            e.target.value,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">
                                        {__('Select Chairman')}
                                    </option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                                {editErrors.chairman_id && (
                                    <p className="text-sm text-destructive">
                                        {editErrors.chairman_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-organization">
                                    {__('Organization Unit')}
                                </Label>
                                <select
                                    id="edit-organization"
                                    value={editData.organization_id}
                                    onChange={(e) =>
                                        setEditData(
                                            'organization_id',
                                            e.target.value,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">
                                        {__('Select Organization Unit')}
                                    </option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                                {editErrors.organization_id && (
                                    <p className="text-sm text-destructive">
                                        {editErrors.organization_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">
                                    {__('Status *')}
                                </Label>
                                <select
                                    id="edit-status"
                                    value={editData.status}
                                    onChange={(e) =>
                                        setEditData(
                                            'status',
                                            e.target.value as any,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="draft">{__('Draft')}</option>
                                    <option value="active">
                                        {__('Active')}
                                    </option>
                                    <option value="inactive">
                                        {__('Inactive')}
                                    </option>
                                    <option value="completed">
                                        {__('Completed')}
                                    </option>
                                </select>
                                {editErrors.status && (
                                    <p className="text-sm text-destructive">
                                        {editErrors.status}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingCommittee(null)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={updating}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs hover:from-violet-700 hover:to-indigo-700"
                            >
                                <Save className="mr-2 h-4 w-4" />{' '}
                                {__('Update Committee')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Committee Modal */}
            <Dialog
                open={deletingCommittee !== null}
                onOpenChange={(open) => !open && setDeletingCommittee(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Committee')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        {__('Are you sure you want to delete')}{' '}
                        <span className="font-bold">
                            {deletingCommittee?.name}
                        </span>{' '}
                        ({deletingCommittee?.code})?
                        <p className="mt-2 font-semibold text-red-500">
                            {__(
                                'Warning: This action will permanently remove the committee and all associated budgets, expenses, and documents. This cannot be undone.',
                            )}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingCommittee(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            {__('Delete permanently')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CommitteesIndex.layout = {
    breadcrumbs: [
        { title: __('Home'), href: '/' },
        { title: __('Committees'), href: '/committees' },
    ],
};
