import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Eye,
    Library,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    TrendingUp,
    X,
    ChevronDown,
    Award,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import PositionController from '@/actions/App/Http/Controllers/Acl/PositionController';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import {
    index as functionalPositionsIndex,
} from '@/routes/functional-positions';
import {
    index as positionNomenclaturesIndex,
} from '@/routes/position-nomenclatures';
import {
    index as positionsIndex,
    organizationPositions as positionsOrganizationPositions,
    show as positionShow,
} from '@/routes/positions';
import type { Auth } from '@/types';

type Position = {
    id: string;
    parent_id: string | null;
    name: string;
    grade: number;
    job_value: number;
    cg: number;
    skp_point: number;
    is_active: number;
    qualification: string | null;
    description: string | null;
    parent?: Position | null;
    created_at: string;
};

type PositionForm = {
    parent_id: string | null;
    name: string;
    grade: number;
    job_value: number;
    cg: number;
    skp_point: number;
    is_active: number;
    qualification: string | null;
    description: string | null;
};

type PageProps = {
    auth: Auth;
    positions: Position[];
    parentPositions: Position[];
    filters: {
        search?: string;
    };
};

function toPositionFormData(position?: Position | null): PositionForm {
    return {
        parent_id: position?.parent_id || null,
        name: position?.name || '',
        grade: position?.grade || 0,
        job_value: position?.job_value || 0,
        cg: position?.cg || 0,
        skp_point: position?.skp_point || 0,
        is_active: position?.is_active ?? 1,
        qualification: position?.qualification || '',
        description: position?.description || '',
    };
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function PositionsIndex({
    positions,
    parentPositions,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const editQueryPositionId =
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('edit')
            : null;
    const initialEditingPosition = editQueryPositionId
        ? positions.find((position) => position.id === editQueryPositionId) ||
          null
        : null;

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingPosition, setEditingPosition] =
        useState<Position | null>(initialEditingPosition);
    const [deletingPosition, setDeletingPosition] = useState<Position | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const currentSearchFilter = filters.search || '';

    useEffect(() => {
        if (debouncedSearch !== currentSearchFilter) {
            router.get(
                positionsIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [currentSearchFilter, debouncedSearch]);

    useEffect(() => {
        if (!editQueryPositionId) {
            return;
        }

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('edit');

        const nextQuery = searchParams.toString();
        const nextUrl = nextQuery
            ? `${window.location.pathname}?${nextQuery}`
            : window.location.pathname;

        window.history.replaceState({}, '', nextUrl);
    }, [editQueryPositionId]);

    const createForm = useForm<PositionForm>(toPositionFormData());
    const editForm = useForm<PositionForm>(
        toPositionFormData(initialEditingPosition),
    );

    const mayManage = can(auth, 'organizations.manage');

    const activePositionsCount = useMemo(
        () => positions.filter((position) => position.is_active).length,
        [positions],
    );
    const rootPositionsCount = useMemo(
        () =>
            positions.filter((position) => position.parent_id === null).length,
        [positions],
    );
    const highestSkpPoint = useMemo(
        () =>
            positions.length > 0
                ? Math.max(...positions.map((position) => position.skp_point))
                : 0,
        [positions],
    );

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.post(PositionController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(position: Position): void {
        setEditingPosition(position);
        editForm.setData(toPositionFormData(position));
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingPosition) {
            return;
        }

        editForm.patch(PositionController.update.url(editingPosition.id), {
            preserveScroll: true,
            onSuccess: () => setEditingPosition(null),
        });
    }

    function destroyPosition(): void {
        if (!deletingPosition) {
            return;
        }

        router.delete(PositionController.destroy.url(deletingPosition.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingPosition(null),
        });
    }

    return (
        <>
            <Head title="Positions" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Positions
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage structural positions, hierarchy, and scoring
                            metrics.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="cursor-pointer gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Position Modules
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={positionsOrganizationPositions()}
                                        className="cursor-pointer flex items-center gap-2 w-full"
                                    >
                                        <Briefcase className="h-4 w-4" />
                                        Organization Positions
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={positionNomenclaturesIndex()}
                                        className="cursor-pointer flex items-center gap-2 w-full"
                                    >
                                        <Library className="h-4 w-4" />
                                        Nomenclatures
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={functionalPositionsIndex()}
                                        className="cursor-pointer flex items-center gap-2 w-full"
                                    >
                                        <Award className="h-4 w-4" />
                                        Functional Positions
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {mayManage && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="cursor-pointer gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Position
                            </Button>
                        )}
                    </div>
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
                                    {positions.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
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
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Highest SKP point
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {highestSkpPoint}
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
                            placeholder="Search positions..."
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

                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className="h-10 rounded-full px-4 text-xs uppercase"
                        >
                            {positions.length} records
                        </Badge>
                        <Badge
                            variant="outline"
                            className="h-10 rounded-full px-4 text-xs uppercase"
                        >
                            {rootPositionsCount} roots
                        </Badge>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1180px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Job Value</th>
                                    <th className="px-6 py-4">CG</th>
                                    <th className="px-6 py-4">SKP Point</th>
                                    <th className="px-6 py-4">Parent</th>
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
                                {positions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No positions found matching your
                                            search.
                                        </td>
                                    </tr>
                                ) : (
                                    positions.map((position) => (
                                        <tr
                                            key={position.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {position.name}
                                                    </span>
                                                    <span className="line-clamp-1 text-xs text-muted-foreground">
                                                        {position.description ||
                                                            'No description provided.'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.grade}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.job_value}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.cg}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.skp_point}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.parent?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${
                                                        position.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    {position.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {dateFormatter.format(
                                                    new Date(
                                                        position.created_at,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={positionShow.url(
                                                            position.id,
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
                                                    {mayManage && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    position,
                                                                )
                                                            }
                                                            aria-label={`Edit ${position.name}`}
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {mayManage && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeletingPosition(
                                                                    position,
                                                                )
                                                            }
                                                            aria-label={`Delete ${position.name}`}
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
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-3xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Create Position
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Add a new position and place it in the structural
                                hierarchy.
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
                                <Label htmlFor="create_parent">
                                    Parent Position
                                </Label>
                                <Select
                                    value={createForm.data.parent_id || 'none'}
                                    onValueChange={(value) =>
                                        createForm.setData(
                                            'parent_id',
                                            value === 'none' ? null : value,
                                        )
                                    }
                                >
                                    <SelectTrigger id="create_parent">
                                        <SelectValue placeholder="Select a parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        {parentPositions.map((position) => (
                                            <SelectItem
                                                key={position.id}
                                                value={position.id}
                                            >
                                                {position.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={createForm.errors.parent_id}
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create_grade">Grade</Label>
                                <Input
                                    id="create_grade"
                                    type="number"
                                    value={createForm.data.grade}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'grade',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.grade} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_job_value">
                                    Job Value
                                </Label>
                                <Input
                                    id="create_job_value"
                                    type="number"
                                    value={createForm.data.job_value}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'job_value',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError
                                    message={createForm.errors.job_value}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_cg">CG</Label>
                                <Input
                                    id="create_cg"
                                    type="number"
                                    value={createForm.data.cg}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'cg',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.cg} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_skp_point">
                                    SKP Point
                                </Label>
                                <Input
                                    id="create_skp_point"
                                    type="number"
                                    value={createForm.data.skp_point}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'skp_point',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError
                                    message={createForm.errors.skp_point}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="create_is_active"
                                checked={createForm.data.is_active === 1}
                                onCheckedChange={(checked) =>
                                    createForm.setData(
                                        'is_active',
                                        checked ? 1 : 0,
                                    )
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="create_is_active">
                                    Active status
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Inactive positions remain available for
                                    historical records.
                                </p>
                            </div>
                        </div>
                        <InputError message={createForm.errors.is_active} />

                        <div className="grid gap-2">
                            <Label htmlFor="create_qualification">
                                Qualification
                            </Label>
                            <Textarea
                                id="create_qualification"
                                value={createForm.data.qualification || ''}
                                onChange={(event) =>
                                    createForm.setData(
                                        'qualification',
                                        event.target.value,
                                    )
                                }
                                rows={4}
                            />
                            <InputError
                                message={createForm.errors.qualification}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create_description">
                                Description
                            </Label>
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
                                Save Position
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingPosition !== null}
                onOpenChange={(open) => !open && setEditingPosition(null)}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-3xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Edit Position
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update hierarchy, scoring metrics, and
                                supporting details for this position.
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
                                <Label htmlFor="edit_parent">
                                    Parent Position
                                </Label>
                                <Select
                                    value={editForm.data.parent_id || 'none'}
                                    onValueChange={(value) =>
                                        editForm.setData(
                                            'parent_id',
                                            value === 'none' ? null : value,
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit_parent">
                                        <SelectValue placeholder="Select a parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        {parentPositions
                                            .filter(
                                                (position) =>
                                                    position.id !==
                                                    editingPosition?.id,
                                            )
                                            .map((position) => (
                                                <SelectItem
                                                    key={position.id}
                                                    value={position.id}
                                                >
                                                    {position.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={editForm.errors.parent_id}
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_grade">Grade</Label>
                                <Input
                                    id="edit_grade"
                                    type="number"
                                    value={editForm.data.grade}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'grade',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.grade} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_job_value">
                                    Job Value
                                </Label>
                                <Input
                                    id="edit_job_value"
                                    type="number"
                                    value={editForm.data.job_value}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'job_value',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError
                                    message={editForm.errors.job_value}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_cg">CG</Label>
                                <Input
                                    id="edit_cg"
                                    type="number"
                                    value={editForm.data.cg}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'cg',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.cg} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_skp_point">
                                    SKP Point
                                </Label>
                                <Input
                                    id="edit_skp_point"
                                    type="number"
                                    value={editForm.data.skp_point}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'skp_point',
                                            Number.parseInt(event.target.value) ||
                                                0,
                                        )
                                    }
                                />
                                <InputError
                                    message={editForm.errors.skp_point}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="edit_is_active"
                                checked={editForm.data.is_active === 1}
                                onCheckedChange={(checked) =>
                                    editForm.setData(
                                        'is_active',
                                        checked ? 1 : 0,
                                    )
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="edit_is_active">
                                    Active status
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Disable this when the position should not be
                                    used for new assignments.
                                </p>
                            </div>
                        </div>
                        <InputError message={editForm.errors.is_active} />

                        <div className="grid gap-2">
                            <Label htmlFor="edit_qualification">
                                Qualification
                            </Label>
                            <Textarea
                                id="edit_qualification"
                                value={editForm.data.qualification || ''}
                                onChange={(event) =>
                                    editForm.setData(
                                        'qualification',
                                        event.target.value,
                                    )
                                }
                                rows={4}
                            />
                            <InputError
                                message={editForm.errors.qualification}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">
                                Description
                            </Label>
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
                                onClick={() => setEditingPosition(null)}
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
                open={deletingPosition !== null}
                onOpenChange={(open) => !open && setDeletingPosition(null)}
            >
                <DialogContent className="rounded-2xl border bg-white sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle>Delete Position</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            {deletingPosition?.name}? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingPosition(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyPosition}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PositionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Positions',
            href: positionsIndex(),
        },
    ],
};
