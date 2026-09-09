import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Eye, Shield, Users, Calendar, DollarSign, FileText, CheckCircle2, AlertCircle, Clock, Save } from 'lucide-react';
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
import type { Auth } from '@/types';
import { store, update, destroy, show } from '@/routes/committees';

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

export default function CommitteesIndex({ committees = [], employees = [], organizations = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
    const [deletingCommittee, setDeletingCommittee] = useState<Committee | null>(null);

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
            (c.objective && c.objective.toLowerCase().includes(search.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>;
            case 'completed':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
            case 'inactive':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"><Clock className="w-3.5 h-3.5" /> Inactive</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"><AlertCircle className="w-3.5 h-3.5" /> Draft</span>;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Committees" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Committees
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage institutional committees, members, tasks, and budgets.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 hover:scale-[1.02]">
                    <Plus className="w-4.5 h-4.5 mr-2" /> New Committee
                </Button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-xs border dark:border-zinc-800">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                    <Input
                        type="text"
                        placeholder="Search by code, name, objective..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 font-medium">Status:</span>
                    <div className="flex rounded-lg border dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                        {['all', 'draft', 'active', 'inactive', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                                    statusFilter === status
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Committees Grid */}
            {filteredCommittees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border rounded-2xl bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xs">
                    <Shield className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No Committees Found</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-md text-center">
                        Try adjusting your search query or status filter, or create a new committee to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommittees.map((committee) => (
                        <div key={committee.id} className="group flex flex-col justify-between overflow-hidden bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-800">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 tracking-wider uppercase bg-violet-50 dark:bg-violet-950/40 px-2.5 py-1 rounded-md">
                                        {committee.code}
                                    </span>
                                    {getStatusBadge(committee.status)}
                                </div>
                                
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
                                        {committee.name}
                                    </h3>
                                    {committee.organization && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Shield className="w-3.5 h-3.5" /> {committee.organization.name}
                                        </p>
                                    )}
                                </div>

                                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 italic min-h-[40px]">
                                    "{committee.objective || 'No objective specified.'}"
                                </p>

                                <div className="border-t pt-4 dark:border-zinc-800 grid grid-cols-2 gap-4 text-xs text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-zinc-400" />
                                        <div>
                                            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Timeline</p>
                                            <p>{committee.start_date || '-'} to {committee.end_date || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-zinc-400" />
                                        <div>
                                            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Chairman</p>
                                            <p className="truncate max-w-[100px]">{committee.chairman?.name || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-zinc-50 dark:bg-zinc-950 px-6 py-4 border-t dark:border-zinc-800 flex justify-between gap-2">
                                <Link
                                    href={show.url(committee.id)}
                                    className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-900/40 border border-violet-200/55 dark:border-violet-800/40 transition-colors"
                                >
                                    <Eye className="w-4 h-4" /> View cockpit
                                </Link>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setEditingCommittee(committee)}
                                    className="border-zinc-200 text-zinc-600 hover:text-violet-600 dark:border-zinc-800 dark:text-zinc-400"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setDeletingCommittee(committee)}
                                    className="border-zinc-200 text-zinc-600 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Committee Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && setIsCreateModalOpen(false)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Create Committee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-code">Code *</Label>
                                <Input
                                    id="create-code"
                                    value={createData.code}
                                    onChange={(e) => setCreateData('code', e.target.value)}
                                    placeholder="e.g. CMT-01"
                                    required
                                />
                                {createErrors.code && <p className="text-sm text-destructive">{createErrors.code}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">Name *</Label>
                                <Input
                                    id="create-name"
                                    value={createData.name}
                                    onChange={(e) => setCreateData('name', e.target.value)}
                                    placeholder="Committee Name"
                                    required
                                />
                                {createErrors.name && <p className="text-sm text-destructive">{createErrors.name}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-objective">Objective</Label>
                            <Textarea
                                id="create-objective"
                                value={createData.objective}
                                onChange={(e) => setCreateData('objective', e.target.value)}
                                placeholder="What is the objective of this committee?"
                                rows={2}
                            />
                            {createErrors.objective && <p className="text-sm text-destructive">{createErrors.objective}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-expected_outcome">Expected Outcome</Label>
                            <Textarea
                                id="create-expected_outcome"
                                value={createData.expected_outcome}
                                onChange={(e) => setCreateData('expected_outcome', e.target.value)}
                                placeholder="What are the expected outcomes?"
                                rows={2}
                            />
                            {createErrors.expected_outcome && <p className="text-sm text-destructive">{createErrors.expected_outcome}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-start_date">Start Date</Label>
                                <Input
                                    id="create-start_date"
                                    type="date"
                                    value={createData.start_date}
                                    onChange={(e) => setCreateData('start_date', e.target.value)}
                                />
                                {createErrors.start_date && <p className="text-sm text-destructive">{createErrors.start_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-end_date">End Date</Label>
                                <Input
                                    id="create-end_date"
                                    type="date"
                                    value={createData.end_date}
                                    onChange={(e) => setCreateData('end_date', e.target.value)}
                                />
                                {createErrors.end_date && <p className="text-sm text-destructive">{createErrors.end_date}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-chairman">Chairman</Label>
                                <select
                                    id="create-chairman"
                                    value={createData.chairman_id}
                                    onChange={(e) => setCreateData('chairman_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">Select Chairman</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                                {createErrors.chairman_id && <p className="text-sm text-destructive">{createErrors.chairman_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-organization">Organization Unit</Label>
                                <select
                                    id="create-organization"
                                    value={createData.organization_id}
                                    onChange={(e) => setCreateData('organization_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">Select Organization Unit</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                                {createErrors.organization_id && <p className="text-sm text-destructive">{createErrors.organization_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-status">Status *</Label>
                                <select
                                    id="create-status"
                                    value={createData.status}
                                    onChange={(e) => setCreateData('status', e.target.value as any)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {createErrors.status && <p className="text-sm text-destructive">{createErrors.status}</p>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creating} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xs">
                                Create Committee
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Committee Modal */}
            <Dialog open={editingCommittee !== null} onOpenChange={(open) => !open && setEditingCommittee(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Committee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-code">Code *</Label>
                                <Input
                                    id="edit-code"
                                    value={editData.code}
                                    onChange={(e) => setEditData('code', e.target.value)}
                                    required
                                />
                                {editErrors.code && <p className="text-sm text-destructive">{editErrors.code}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    required
                                />
                                {editErrors.name && <p className="text-sm text-destructive">{editErrors.name}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-objective">Objective</Label>
                            <Textarea
                                id="edit-objective"
                                value={editData.objective}
                                onChange={(e) => setEditData('objective', e.target.value)}
                                rows={2}
                            />
                            {editErrors.objective && <p className="text-sm text-destructive">{editErrors.objective}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-expected_outcome">Expected Outcome</Label>
                            <Textarea
                                id="edit-expected_outcome"
                                value={editData.expected_outcome}
                                onChange={(e) => setEditData('expected_outcome', e.target.value)}
                                rows={2}
                            />
                            {editErrors.expected_outcome && <p className="text-sm text-destructive">{editErrors.expected_outcome}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-start_date">Start Date</Label>
                                <Input
                                    id="edit-start_date"
                                    type="date"
                                    value={editData.start_date}
                                    onChange={(e) => setEditData('start_date', e.target.value)}
                                />
                                {editErrors.start_date && <p className="text-sm text-destructive">{editErrors.start_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-end_date">End Date</Label>
                                <Input
                                    id="edit-end_date"
                                    type="date"
                                    value={editData.end_date}
                                    onChange={(e) => setEditData('end_date', e.target.value)}
                                />
                                {editErrors.end_date && <p className="text-sm text-destructive">{editErrors.end_date}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-chairman">Chairman</Label>
                                <select
                                    id="edit-chairman"
                                    value={editData.chairman_id}
                                    onChange={(e) => setEditData('chairman_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">Select Chairman</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                                {editErrors.chairman_id && <p className="text-sm text-destructive">{editErrors.chairman_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-organization">Organization Unit</Label>
                                <select
                                    id="edit-organization"
                                    value={editData.organization_id}
                                    onChange={(e) => setEditData('organization_id', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="">Select Organization Unit</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                                {editErrors.organization_id && <p className="text-sm text-destructive">{editErrors.organization_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status *</Label>
                                <select
                                    id="edit-status"
                                    value={editData.status}
                                    onChange={(e) => setEditData('status', e.target.value as any)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {editErrors.status && <p className="text-sm text-destructive">{editErrors.status}</p>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingCommittee(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updating} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xs">
                                <Save className="w-4 h-4 mr-2" /> Update Committee
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Committee Modal */}
            <Dialog open={deletingCommittee !== null} onOpenChange={(open) => !open && setDeletingCommittee(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Committee</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to delete <span className="font-bold">{deletingCommittee?.name}</span> ({deletingCommittee?.code})?
                        <p className="text-red-500 font-semibold mt-2">Warning: This action will permanently remove the committee and all associated budgets, expenses, and documents. This cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingCommittee(null)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Delete permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CommitteesIndex.layout = {
    breadcrumbs: [
        { title: 'Home', href: '/' },
        { title: 'Committees', href: '/committees' },
    ],
};
