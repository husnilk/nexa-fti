import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Activity,
    Award,
    Briefcase,
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import FunctionalPositionController from '@/actions/App/Http/Controllers/Acl/FunctionalPositionController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import {
    index as functionalPositionsIndex,
    show as functionalPositionShow,
} from '@/routes/functional-positions';
import type { Auth } from '@/types';

type FunctionalPosition = {
    id: string;
    name: string;
    code: string;
    description: string | null;
    level: number;
    grade: number;
    job_value: number;
    is_active: boolean;
    created_at: string;
};

type FunctionalPositionForm = {
    name: string;
    code: string;
    description: string | null;
    level: number;
    grade: number;
    job_value: number;
    is_active: boolean;
};

type PageProps = {
    auth: Auth;
    functionalPositions: FunctionalPosition[];
    filters: {
        search?: string;
    };
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function FunctionalPositionsIndex({
    functionalPositions,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingFP, setEditingFP] = useState<FunctionalPosition | null>(null);
    const [deletingFP, setDeletingFP] = useState<FunctionalPosition | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const currentSearchFilter = filters.search || '';

    useEffect(() => {
        if (debouncedSearch !== currentSearchFilter) {
            router.get(
                functionalPositionsIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [currentSearchFilter, debouncedSearch]);

    const createForm = useForm<FunctionalPositionForm>({
        name: '',
        code: '',
        description: '',
        level: 0,
        grade: 0,
        job_value: 0,
        is_active: true,
    });

    const editForm = useForm<FunctionalPositionForm>({
        name: '',
        code: '',
        description: '',
        level: 0,
        grade: 0,
        job_value: 0,
        is_active: true,
    });

    const mayCreate = can(auth, 'organizations.manage');
    const mayUpdate = can(auth, 'organizations.manage');
    const mayDelete = can(auth, 'organizations.manage');

    const activePositionsCount = useMemo(
        () =>
            functionalPositions.filter((functionalPosition) =>
                functionalPosition.is_active,
            ).length,
        [functionalPositions],
    );
    const highestJobValue = useMemo(
        () =>
            functionalPositions.length > 0
                ? Math.max(
                      ...functionalPositions.map(
                          (functionalPosition) => functionalPosition.job_value,
                      ),
                  )
                : 0,
        [functionalPositions],
    );

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.post(FunctionalPositionController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(fp: FunctionalPosition): void {
        setEditingFP(fp);
        editForm.setData({
            name: fp.name,
            code: fp.code,
            description: fp.description || '',
            level: fp.level,
            grade: fp.grade,
            job_value: fp.job_value,
            is_active: fp.is_active,
        });
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingFP) {
            return;
        }

        editForm.patch(FunctionalPositionController.update.url(editingFP.id), {
            preserveScroll: true,
            onSuccess: () => setEditingFP(null),
        });
    }

    function destroyFP(): void {
        if (!deletingFP) {
            return;
        }

        router.delete(FunctionalPositionController.destroy.url(deletingFP.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingFP(null),
        });
    }

    return (
        <>
            <Head title="Functional Positions" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Functional Positions
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage standardized functional job levels, grades,
                            job values, and active status.
                        </p>
                    </div>

                    {mayCreate && (
                        <Button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="cursor-pointer gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Functional Position
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total positions
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {functionalPositions.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Active positions
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {activePositionsCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Highest job value
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {highestJobValue}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search functional positions..."
                            className="bg-white pl-9 dark:bg-zinc-900"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Badge
                        variant="outline"
                        className="h-10 rounded-full px-4 text-xs uppercase"
                    >
                        {functionalPositions.length} records
                    </Badge>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1040px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Job Value</th>
                                    <th className="px-6 py-4 text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {functionalPositions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No functional positions found matching
                                            your search.
                                        </td>
                                    </tr>
                                ) : (
                                    functionalPositions.map((fp) => (
                                        <tr
                                            key={fp.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {fp.name}
                                                    </span>
                                                    <span className="line-clamp-1 text-xs text-muted-foreground">
                                                        {fp.description ||
                                                            'No description provided.'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium dark:bg-zinc-800">
                                                    {fp.code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-full px-3 py-1"
                                                >
                                                    Level {fp.level}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {fp.grade}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {fp.job_value}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${
                                                        fp.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    {fp.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {dateFormatter.format(
                                                    new Date(fp.created_at),
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={functionalPositionShow.url(
                                                            fp.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayUpdate && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    fp,
                                                                )
                                                            }
                                                            aria-label={`Edit ${fp.name}`}
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {mayDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeletingFP(
                                                                    fp,
                                                                )
                                                            }
                                                            aria-label={`Delete ${fp.name}`}
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Create Functional Position
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Add a new standardized functional position
                                record.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="grid gap-5 p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="create_name">Name</Label>
                                <Input
                                    id="create_name"
                                    value={createForm.data.name}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_code">Code</Label>
                                <Input
                                    id="create_code"
                                    value={createForm.data.code}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'code',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.code} />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="create_level">Level</Label>
                                <Input
                                    id="create_level"
                                    type="number"
                                    value={createForm.data.level}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'level',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.level} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_grade">Grade</Label>
                                <Input
                                    id="create_grade"
                                    type="number"
                                    value={createForm.data.grade}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'grade',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.grade} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_job_value">Job Value</Label>
                                <Input
                                    id="create_job_value"
                                    type="number"
                                    value={createForm.data.job_value}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'job_value',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError
                                    message={createForm.errors.job_value}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="create_is_active"
                                checked={createForm.data.is_active}
                                onCheckedChange={(checked) =>
                                    createForm.setData('is_active', checked)
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="create_is_active">
                                    Active status
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Inactive positions remain stored but are
                                    visually marked in the list.
                                </p>
                            </div>
                        </div>
                        <InputError message={createForm.errors.is_active} />

                        <div className="grid gap-2">
                            <Label htmlFor="create_description">Description</Label>
                            <Textarea
                                id="create_description"
                                value={createForm.data.description || ''}
                                onChange={(event) =>
                                    createForm.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                rows={5}
                            />
                            <InputError
                                message={createForm.errors.description}
                            />
                        </div>

                        <DialogFooter className="border-t pt-4 dark:border-zinc-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                Save Functional Position
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingFP !== null}
                onOpenChange={(open) => !open && setEditingFP(null)}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Edit Functional Position
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update the level, grade, job value, and status
                                for this functional position.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="grid gap-5 p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_name">Name</Label>
                                <Input
                                    id="edit_name"
                                    value={editForm.data.name}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_code">Code</Label>
                                <Input
                                    id="edit_code"
                                    value={editForm.data.code}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'code',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.code} />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_level">Level</Label>
                                <Input
                                    id="edit_level"
                                    type="number"
                                    value={editForm.data.level}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'level',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.level} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_grade">Grade</Label>
                                <Input
                                    id="edit_grade"
                                    type="number"
                                    value={editForm.data.grade}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'grade',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.grade} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_job_value">Job Value</Label>
                                <Input
                                    id="edit_job_value"
                                    type="number"
                                    value={editForm.data.job_value}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'job_value',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError
                                    message={editForm.errors.job_value}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="edit_is_active"
                                checked={editForm.data.is_active}
                                onCheckedChange={(checked) =>
                                    editForm.setData('is_active', checked)
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="edit_is_active">
                                    Active status
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Disable this when the functional position
                                    should no longer be used.
                                </p>
                            </div>
                        </div>
                        <InputError message={editForm.errors.is_active} />

                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">Description</Label>
                            <Textarea
                                id="edit_description"
                                value={editForm.data.description || ''}
                                onChange={(event) =>
                                    editForm.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                rows={5}
                            />
                            <InputError message={editForm.errors.description} />
                        </div>

                        <DialogFooter className="border-t pt-4 dark:border-zinc-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingFP(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingFP !== null}
                onOpenChange={(open) => !open && setDeletingFP(null)}
            >
                <DialogContent className="rounded-2xl border bg-white sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle>Delete Functional Position</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deletingFP?.name}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingFP(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyFP}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

FunctionalPositionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Functional Positions',
            href: functionalPositionsIndex(),
        },
    ],
};
