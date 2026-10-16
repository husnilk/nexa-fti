import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Shield } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
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

export default function CreateCommittee({
    employees = [],
    organizations = [],
}: PageProps) {
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
        <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8">
            <Head title={__('Create Committee')} />

            <div className="border-b pb-5 dark:border-zinc-800">
                <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                    {__('Create Committee')}
                </h1>
                <p className="mt-1 text-muted-foreground">
                    {__(
                        'Initialize a new committee, its objectives, and its unit.',
                    )}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="create-code">{__('Code *')}</Label>
                        <Input
                            id="create-code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder={__('e.g. CMT-01')}
                            required
                        />
                        {errors.code && (
                            <p className="text-sm text-destructive">
                                {errors.code}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="create-name">{__('Name *')}</Label>
                        <Input
                            id="create-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={__('Committee Name')}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="create-objective">{__('Objective')}</Label>
                    <Textarea
                        id="create-objective"
                        value={data.objective}
                        onChange={(e) => setData('objective', e.target.value)}
                        placeholder={__(
                            'What is the objective of this committee?',
                        )}
                        rows={2}
                    />
                    {errors.objective && (
                        <p className="text-sm text-destructive">
                            {errors.objective}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="create-expected_outcome">
                        {__('Expected Outcome')}
                    </Label>
                    <Textarea
                        id="create-expected_outcome"
                        value={data.expected_outcome}
                        onChange={(e) =>
                            setData('expected_outcome', e.target.value)
                        }
                        placeholder={__('What are the expected outcomes?')}
                        rows={2}
                    />
                    {errors.expected_outcome && (
                        <p className="text-sm text-destructive">
                            {errors.expected_outcome}
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
                            value={data.start_date}
                            onChange={(e) =>
                                setData('start_date', e.target.value)
                            }
                        />
                        {errors.start_date && (
                            <p className="text-sm text-destructive">
                                {errors.start_date}
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
                            value={data.end_date}
                            onChange={(e) =>
                                setData('end_date', e.target.value)
                            }
                        />
                        {errors.end_date && (
                            <p className="text-sm text-destructive">
                                {errors.end_date}
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
                            value={data.chairman_id}
                            onChange={(e) =>
                                setData('chairman_id', e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="">{__('Select Chairman')}</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                        {errors.chairman_id && (
                            <p className="text-sm text-destructive">
                                {errors.chairman_id}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="create-organization">
                            {__('Organization Unit')}
                        </Label>
                        <select
                            id="create-organization"
                            value={data.organization_id}
                            onChange={(e) =>
                                setData('organization_id', e.target.value)
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
                        {errors.organization_id && (
                            <p className="text-sm text-destructive">
                                {errors.organization_id}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="create-status">{__('Status *')}</Label>
                        <select
                            id="create-status"
                            value={data.status}
                            onChange={(e) =>
                                setData('status', e.target.value as any)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="draft">{__('Draft')}</option>
                            <option value="active">{__('Active')}</option>
                            <option value="inactive">{__('Inactive')}</option>
                            <option value="completed">{__('Completed')}</option>
                        </select>
                        {errors.status && (
                            <p className="text-sm text-destructive">
                                {errors.status}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="create-desc">{__('Description')}</Label>
                    <Textarea
                        id="create-desc"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder={__(
                            'Detailed description of the committee...',
                        )}
                        rows={4}
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between border-t pt-4 dark:border-zinc-800">
                    <Link
                        href={index.url()}
                        className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        {__('Cancel')}
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs hover:from-violet-700 hover:to-indigo-700"
                    >
                        <Save className="mr-2 h-4 w-4" /> {__('Save Committee')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

CreateCommittee.layout = {
    breadcrumbs: [
        { title: __('Home'), href: '/' },
        { title: __('Committees'), href: '/committees' },
        { title: __('Create'), href: '#' },
    ],
};
