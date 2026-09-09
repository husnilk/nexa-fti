import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    CalendarDays,
    ChevronRight,
    Edit,
    FileText,
    GitBranch,
    Network,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import {
    destroy as destroyOrganizationPositionAction,
    store as storeOrganizationPositionAction,
    update as updateOrganizationPositionAction,
} from '@/actions/App/Http/Controllers/Acl/OrganizationPositionController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    index as organizationsIndex,
    show as organizationShow,
    structure as organizationsStructure,
} from '@/routes/organizations';
import type { Auth } from '@/types';

type AvailablePosition = {
    id: string;
    name: string;
    grade: number;
    job_value: number;
    cg: number;
    skp_point: number;
    is_active: boolean | number;
};

type OrganizationPosition = {
    id: number;
    organization_id: string;
    position_id: string;
    grade: number;
    job_value: number;
    cg: number;
    is_active: boolean;
    position?: AvailablePosition | null;
};

type Organization = {
    id: string;
    parent_id: string | null;
    name: string;
    code: string;
    is_active: boolean;
    description: string | null;
    parent?: Organization | null;
    children?: Organization[];
    organization_positions?: OrganizationPosition[];
    organization_type?: {
        id: string;
        name: string;
        level: number;
    } | null;
    created_at: string;
};

type OrganizationPositionForm = {
    organization_id: string;
    position_id: string;
    grade: number;
    job_value: number;
    cg: number;
    is_active: boolean;
};

type PageProps = {
    auth: Auth;
    organization: Organization;
    availablePositions: AvailablePosition[];
};

function toOrganizationPositionFormData(
    organizationId: string,
    organizationPosition?: OrganizationPosition | null,
): OrganizationPositionForm {
    return {
        organization_id: organizationId,
        position_id: organizationPosition?.position_id || '',
        grade: organizationPosition?.grade || 0,
        job_value: organizationPosition?.job_value || 0,
        cg: organizationPosition?.cg || 0,
        is_active: organizationPosition?.is_active ?? true,
    };
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
});

export default function OrganizationShow({
    organization,
    availablePositions,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayManage =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('organization.manage') ||
        auth.permissions.includes('organizations.manage');

    const [isCreatingPosition, setIsCreatingPosition] = useState(false);
    const [editingOrganizationPosition, setEditingOrganizationPosition] =
        useState<OrganizationPosition | null>(null);
    const [deletingOrganizationPosition, setDeletingOrganizationPosition] =
        useState<OrganizationPosition | null>(null);

    const createForm = useForm<OrganizationPositionForm>(
        toOrganizationPositionFormData(organization.id),
    );
    const editForm = useForm<OrganizationPositionForm>(
        toOrganizationPositionFormData(organization.id),
    );

    const organizationPositions = organization.organization_positions || [];
    const assignedPositionIds = new Set(
        organizationPositions.map((organizationPosition) => organizationPosition.position_id),
    );
    const creatablePositions = availablePositions.filter(
        (position) => !assignedPositionIds.has(position.id),
    );
    const editablePositions = availablePositions.filter(
        (position) =>
            !assignedPositionIds.has(position.id) ||
            position.id === editingOrganizationPosition?.position_id,
    );

    function applyPositionDefaults(
        positionId: string,
        currentData: OrganizationPositionForm,
        setData: (data: OrganizationPositionForm) => void,
    ): void {
        const selectedPosition = availablePositions.find(
            (position) => position.id === positionId,
        );

        setData({
            ...currentData,
            position_id: positionId,
            grade: selectedPosition?.grade ?? 0,
            job_value: selectedPosition?.job_value ?? 0,
            cg: selectedPosition?.cg ?? 0,
            is_active: Boolean(selectedPosition?.is_active ?? true),
        });
    }

    function submitCreateOrganizationPosition(
        event: FormEvent<HTMLFormElement>,
    ): void {
        event.preventDefault();

        createForm.post(storeOrganizationPositionAction.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreatingPosition(false);
                createForm.reset();
                createForm.setData(toOrganizationPositionFormData(organization.id));
            },
        });
    }

    function openEditOrganizationPosition(
        organizationPosition: OrganizationPosition,
    ): void {
        setEditingOrganizationPosition(organizationPosition);
        editForm.setData(
            toOrganizationPositionFormData(organization.id, organizationPosition),
        );
        editForm.clearErrors();
    }

    function submitEditOrganizationPosition(
        event: FormEvent<HTMLFormElement>,
    ): void {
        event.preventDefault();

        if (!editingOrganizationPosition) {
            return;
        }

        editForm.patch(
            updateOrganizationPositionAction.url(
                editingOrganizationPosition.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setEditingOrganizationPosition(null),
            },
        );
    }

    function destroyOrganizationPosition(): void {
        if (!deletingOrganizationPosition) {
            return;
        }

        router.delete(
            destroyOrganizationPositionAction.url(
                deletingOrganizationPosition.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingOrganizationPosition(null),
            },
        );
    }

    return (
        <>
            <Head title={`Organization: ${organization.name}`} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                    <Link href={organizationsIndex()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {organization.name}
                            </h1>
                            <Badge
                                variant={
                                    organization.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="rounded-full px-3 py-1 uppercase"
                            >
                                {organization.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review hierarchy, metadata, linked positions, and
                            sub-organizations.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href={organizationsStructure()}>
                                <Network className="h-4 w-4" />
                                Structure
                            </Link>
                        </Button>
                        {mayManage && (
                            <Button asChild>
                                <Link
                                    href={organizationsIndex.url({
                                        query: { edit: organization.id },
                                    })}
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit Organization
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="border-b pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                                Organization Details
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono">
                                        {organization.code}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Network className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {organization.organization_type?.name ||
                                            '-'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {dateFormatter.format(
                                            new Date(organization.created_at),
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-start gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <GitBranch className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Parent
                                        </span>
                                        {organization.parent ? (
                                            <Link
                                                href={organizationShow.url(
                                                    organization.parent.id,
                                                )}
                                                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                {organization.parent.name}
                                            </Link>
                                        ) : (
                                            <span>No parent organization</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-3">
                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-2 border-b pb-3 dark:border-zinc-800">
                                <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    Description
                                </h3>
                            </div>

                            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                                {organization.description ||
                                    'No description provided.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        Positions in Organization
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        {organizationPositions.length} total
                                    </span>
                                    {mayManage && (
                                        <Button
                                            size="sm"
                                            onClick={() => setIsCreatingPosition(true)}
                                            disabled={creatablePositions.length === 0}
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            Add Position
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {organizationPositions.length > 0 ? (
                                <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {organizationPositions.map((organizationPosition) => (
                                        <div
                                            key={organizationPosition.id}
                                            className="flex items-start justify-between gap-4 py-4"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {organizationPosition.position?.name ||
                                                            '-'}
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            organizationPosition.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="rounded-full px-2.5 py-1 text-[10px] uppercase"
                                                    >
                                                        {organizationPosition.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                    <span>
                                                        Grade:{' '}
                                                        {organizationPosition.grade}
                                                    </span>
                                                    <span>
                                                        Job Value:{' '}
                                                        {organizationPosition.job_value}
                                                    </span>
                                                    <span>
                                                        CG: {organizationPosition.cg}
                                                    </span>
                                                    {organizationPosition.position ? (
                                                        <span>
                                                            Position SKP:{' '}
                                                            {organizationPosition.position
                                                                .skp_point}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {mayManage && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEditOrganizationPosition(
                                                                organizationPosition,
                                                            )
                                                        }
                                                        className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeletingOrganizationPosition(
                                                                organizationPosition,
                                                            )
                                                        }
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    No positions are currently assigned to this
                                    organization.
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <GitBranch className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        Sub-Organizations
                                    </h3>
                                </div>
                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                    {organization.children?.length || 0} total
                                </span>
                            </div>

                            {organization.children &&
                            organization.children.length > 0 ? (
                                <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {organization.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={organizationShow.url(child.id)}
                                            className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {child.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {child.code} •{' '}
                                                    {child.organization_type
                                                        ?.name || '-'}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    No sub-organizations found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isCreatingPosition} onOpenChange={setIsCreatingPosition}>
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Add Position to Organization
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Choose a position and adjust the organization-specific
                                grade, job value, and CG values.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form
                        onSubmit={submitCreateOrganizationPosition}
                        className="grid gap-5 p-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="create_position_id">Position</Label>
                            <Select
                                value={createForm.data.position_id}
                                onValueChange={(value) =>
                                    applyPositionDefaults(
                                        value,
                                        createForm.data,
                                        createForm.setData,
                                    )
                                }
                            >
                                <SelectTrigger id="create_position_id">
                                    <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {creatablePositions.map((position) => (
                                        <SelectItem key={position.id} value={position.id}>
                                            {position.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.position_id} />
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
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

                            <div className="grid gap-2">
                                <Label htmlFor="create_cg">CG</Label>
                                <Input
                                    id="create_cg"
                                    type="number"
                                    value={createForm.data.cg}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'cg',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.cg} />
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
                                    Keep this enabled while the position is active
                                    in the organization.
                                </p>
                            </div>
                        </div>
                        <InputError message={createForm.errors.is_active} />

                        <DialogFooter className="border-t pt-4 dark:border-zinc-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreatingPosition(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    createForm.processing ||
                                    creatablePositions.length === 0
                                }
                            >
                                Save Position Assignment
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingOrganizationPosition !== null}
                onOpenChange={(open) =>
                    !open && setEditingOrganizationPosition(null)
                }
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Edit Organization Position
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update the position assignment values for this
                                organization.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form
                        onSubmit={submitEditOrganizationPosition}
                        className="grid gap-5 p-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="edit_position_id">Position</Label>
                            <Select
                                value={editForm.data.position_id}
                                onValueChange={(value) =>
                                    applyPositionDefaults(
                                        value,
                                        editForm.data,
                                        editForm.setData,
                                    )
                                }
                            >
                                <SelectTrigger id="edit_position_id">
                                    <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {editablePositions.map((position) => (
                                        <SelectItem key={position.id} value={position.id}>
                                            {position.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.position_id} />
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
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

                            <div className="grid gap-2">
                                <Label htmlFor="edit_cg">CG</Label>
                                <Input
                                    id="edit_cg"
                                    type="number"
                                    value={editForm.data.cg}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'cg',
                                            Number.parseInt(event.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.cg} />
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
                                    Disable this when the position should no longer
                                    appear as active in the organization.
                                </p>
                            </div>
                        </div>
                        <InputError message={editForm.errors.is_active} />

                        <DialogFooter className="border-t pt-4 dark:border-zinc-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingOrganizationPosition(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingOrganizationPosition !== null}
                onOpenChange={(open) =>
                    !open && setDeletingOrganizationPosition(null)
                }
            >
                <DialogContent className="rounded-2xl border bg-white sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle>Remove Position from Organization</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove{' '}
                            {deletingOrganizationPosition?.position?.name || 'this position'}
                            {' '}from this organization?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingOrganizationPosition(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyOrganizationPosition}
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

OrganizationShow.layout = {
    breadcrumbs: [
        {
            title: 'Organizations',
            href: organizationsIndex(),
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
