import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Shield } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store, index } from '@/routes/committees';
type Employee = {
    id: string;
    name: string;
};

type Organization = {
    id: string;
    name: string;
};

type PageProps = {
    employees: Employee[];
    organizations: Organization[];
};

export default function CreateCommittee({ employees = [], organizations = [] }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
            <Head title="Create Committee" />
            
            <div className="border-b pb-5 dark:border-zinc-800">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                    Create Committee
                </h1>
                <p className="text-muted-foreground mt-1">Initialize a new committee, its objectives, and its unit.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="create-code">Code *</Label>
                        <Input
                            id="create-code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="e.g. CMT-01"
                            required
                        />
                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="create-name">Name *</Label>
                        <Input
                            id="create-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Committee Name"
                            required
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="create-objective">Objective</Label>
                    <Textarea
                        id="create-objective"
                        value={data.objective}
                        onChange={(e) => setData('objective', e.target.value)}
                        placeholder="What is the objective of this committee?"
                        rows={2}
                    />
                    {errors.objective && <p className="text-sm text-destructive">{errors.objective}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="create-expected_outcome">Expected Outcome</Label>
                    <Textarea
                        id="create-expected_outcome"
                        value={data.expected_outcome}
                        onChange={(e) => setData('expected_outcome', e.target.value)}
                        placeholder="What are the expected outcomes?"
                        rows={2}
                    />
                    {errors.expected_outcome && <p className="text-sm text-destructive">{errors.expected_outcome}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="create-start_date">Start Date</Label>
                        <Input
                            id="create-start_date"
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                        {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="create-end_date">End Date</Label>
                        <Input
                            id="create-end_date"
                            type="date"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                        />
                        {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="create-chairman">Chairman</Label>
                        <select
                            id="create-chairman"
                            value={data.chairman_id}
                            onChange={(e) => setData('chairman_id', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="">Select Chairman</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                        {errors.chairman_id && <p className="text-sm text-destructive">{errors.chairman_id}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="create-organization">Organization Unit</Label>
                        <select
                            id="create-organization"
                            value={data.organization_id}
                            onChange={(e) => setData('organization_id', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="">Select Organization Unit</option>
                            {organizations.map((org) => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </select>
                        {errors.organization_id && <p className="text-sm text-destructive">{errors.organization_id}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="create-status">Status *</Label>
                        <select
                            id="create-status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as any)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="completed">Completed</option>
                        </select>
                        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="create-desc">Description</Label>
                    <Textarea
                        id="create-desc"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Detailed description of the committee..."
                        rows={4}
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="flex justify-between items-center pt-4 border-t dark:border-zinc-800">
                    <Link
                        href={index.url()}
                        className="inline-flex justify-center items-center px-4 py-2 text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <Button type="submit" disabled={processing} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xs">
                        <Save className="w-4 h-4 mr-2" /> Save Committee
                    </Button>
                </div>
            </form>
        </div>
    );
}

CreateCommittee.layout = {
    breadcrumbs: [
        { title: 'Home', href: '/' },
        { title: 'Committees', href: '/committees' },
        { title: 'Create', href: '#' },
    ],
};
