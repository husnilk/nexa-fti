import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Briefcase,
    CalendarDays,
    ChevronRight,
    Edit,
    FileText,
    GitBranch,
    Pencil,
    Plus,
    ShieldCheck,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import PositionResponsibilityController from '@/actions/App/Http/Controllers/Acl/PositionResponsibilityController';
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
import { Textarea } from '@/components/ui/textarea';
import {
    index as positionsIndex,
    show as positionShow,
} from '@/routes/positions';
import type { Auth } from '@/types';

type PositionResponsibility = {
    id: string;
    position_id: string;
    title: string;
    description: string | null;
    type: 'primary' | 'secondary';
    order: number;
    created_at: string;
};

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
    children?: Position[];
    responsibilities?: PositionResponsibility[];
    created_at: string;
};

type ResponsibilityForm = {
    position_id: string;
    title: string;
    description: string | null;
    type: 'primary' | 'secondary';
    order: number;
};

type PageProps = {
    auth: Auth;
    position: Position;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function PositionShow({ position }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayManage = can(auth, 'organizations.manage');
    const [isCreatingResponsibility, setIsCreatingResponsibility] =
        useState(false);
    const [editingResponsibility, setEditingResponsibility] =
        useState<PositionResponsibility | null>(null);
    const [deletingResponsibility, setDeletingResponsibility] =
        useState<PositionResponsibility | null>(null);

    const createForm = useForm<ResponsibilityForm>({
        position_id: position.id,
        title: '',
        description: '',
        type: 'primary',
        order: (position.responsibilities?.length || 0) + 1,
    });

    const editForm = useForm<ResponsibilityForm>({
        position_id: position.id,
        title: '',
        description: '',
        type: 'primary',
        order: 0,
    });

    function submitCreateResponsibility(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.post(PositionResponsibilityController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreatingResponsibility(false);
                createForm.reset();
            },
        });
    }

    function openEditResponsibility(
        responsibility: PositionResponsibility,
    ): void {
        setEditingResponsibility(responsibility);
        editForm.setData({
            position_id: responsibility.position_id,
            title: responsibility.title,
            description: responsibility.description || '',
            type: responsibility.type,
            order: responsibility.order,
        });
        editForm.clearErrors();
    }

    function submitEditResponsibility(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingResponsibility) {
            return;
        }

        editForm.patch(
            PositionResponsibilityController.update.url(
                editingResponsibility.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setEditingResponsibility(null),
            },
        );
    }

    function destroyResponsibility(): void {
        if (!deletingResponsibility) {
            return;
        }

        router.delete(
            PositionResponsibilityController.destroy.url(
                deletingResponsibility.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingResponsibility(null),
            },
        );
    }

    return (
        <>
            <Head title={`Position: ${position.name}`} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                    <Link href={positionsIndex()}>
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
                                {position.name}
                            </h1>
                            <Badge
                                variant={
                                    position.is_active ? 'default' : 'secondary'
                                }
                                className="rounded-full px-3 py-1 uppercase"
                            >
                                {position.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review hierarchy, scoring metrics, qualifications,
                            and responsibilities for this position.
                        </p>
                    </div>
                    {mayManage && (
                        <Button asChild>
                            <Link
                                href={positionsIndex.url({
                                    query: { edit: position.id },
                                })}
                            >
                                <Edit className="h-4 w-4" />
                                Edit Position
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="border-b pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                                Position Details
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>Grade {position.grade}</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span>Job Value {position.job_value}</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                    <span>CG {position.cg}</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span>SKP Point {position.skp_point}</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {dateFormatter.format(
                                            new Date(position.created_at),
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-start gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <GitBranch className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Parent
                                        </span>
                                        {position.parent ? (
                                            <Link
                                                href={positionShow.url(
                                                    position.parent.id,
                                                )}
                                                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                {position.parent.name}
                                            </Link>
                                        ) : (
                                            <span>No parent position</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <GitBranch className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        Child Positions
                                    </h3>
                                </div>
                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                    {position.children?.length || 0} total
                                </span>
                            </div>

                            {position.children && position.children.length > 0 ? (
                                <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {position.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={positionShow.url(child.id)}
                                            className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {child.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    Grade {child.grade} • CG{' '}
                                                    {child.cg}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    No child positions found.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-3">
                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-2 border-b pb-3 dark:border-zinc-800">
                                <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    Qualification
                                </h3>
                            </div>

                            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                                {position.qualification ||
                                    'No qualification provided.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-2 border-b pb-3 dark:border-zinc-800">
                                <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    Description
                                </h3>
                            </div>

                            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                                {position.description ||
                                    'No description provided.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        Responsibilities
                                    </h3>
                                </div>
                                {mayManage && (
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setIsCreatingResponsibility(true)
                                        }
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Add
                                    </Button>
                                )}
                            </div>

                            <div className="mt-4 space-y-4">
                                {position.responsibilities &&
                                position.responsibilities.length > 0 ? (
                                    position.responsibilities.map(
                                        (responsibility) => (
                                            <div
                                                key={responsibility.id}
                                                className="group relative rounded-xl border p-4 transition-colors hover:border-primary/50 dark:border-zinc-800"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                                                #
                                                                {
                                                                    responsibility.order
                                                                }
                                                            </span>
                                                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                                {
                                                                    responsibility.title
                                                                }
                                                            </h4>
                                                            <Badge
                                                                variant="outline"
                                                                className="h-5 text-[10px] uppercase"
                                                            >
                                                                {
                                                                    responsibility.type
                                                                }
                                                            </Badge>
                                                        </div>
                                                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                                            {responsibility.description ||
                                                                'No description provided.'}
                                                        </p>
                                                    </div>
                                                    {mayManage && (
                                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                onClick={() =>
                                                                    openEditResponsibility(
                                                                        responsibility,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-destructive"
                                                                onClick={() =>
                                                                    setDeletingResponsibility(
                                                                        responsibility,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed py-10 text-center text-sm text-muted-foreground dark:border-zinc-800">
                                        No responsibilities defined for this
                                        position yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={isCreatingResponsibility}
                onOpenChange={setIsCreatingResponsibility}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Add Responsibility
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Define a new responsibility for this position.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <form
                        onSubmit={submitCreateResponsibility}
                        className="grid gap-5 p-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="resp_title">Title</Label>
                            <Input
                                id="resp_title"
                                value={createForm.data.title}
                                onChange={(event) =>
                                    createForm.setData(
                                        'title',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={createForm.errors.title} />
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="resp_type">Type</Label>
                                <Select
                                    value={createForm.data.type}
                                    onValueChange={(
                                        value: 'primary' | 'secondary',
                                    ) => createForm.setData('type', value)}
                                >
                                    <SelectTrigger id="resp_type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="primary">
                                            Primary
                                        </SelectItem>
                                        <SelectItem value="secondary">
                                            Secondary
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.type} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="resp_order">Order</Label>
                                <Input
                                    type="number"
                                    id="resp_order"
                                    value={createForm.data.order}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'order',
                                            Number.parseInt(
                                                event.target.value,
                                            ) || 0,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.order} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="resp_desc">Description</Label>
                            <Textarea
                                id="resp_desc"
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
                                onClick={() =>
                                    setIsCreatingResponsibility(false)
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                Save Responsibility
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingResponsibility !== null}
                onOpenChange={(open) => !open && setEditingResponsibility(null)}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Edit Responsibility
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update the responsibility details.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <form
                        onSubmit={submitEditResponsibility}
                        className="grid gap-5 p-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="edit_resp_title">Title</Label>
                            <Input
                                id="edit_resp_title"
                                value={editForm.data.title}
                                onChange={(event) =>
                                    editForm.setData(
                                        'title',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={editForm.errors.title} />
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_resp_type">Type</Label>
                                <Select
                                    value={editForm.data.type}
                                    onValueChange={(
                                        value: 'primary' | 'secondary',
                                    ) => editForm.setData('type', value)}
                                >
                                    <SelectTrigger id="edit_resp_type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="primary">
                                            Primary
                                        </SelectItem>
                                        <SelectItem value="secondary">
                                            Secondary
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.type} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_resp_order">Order</Label>
                                <Input
                                    type="number"
                                    id="edit_resp_order"
                                    value={editForm.data.order}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'order',
                                            Number.parseInt(
                                                event.target.value,
                                            ) || 0,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.order} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_resp_desc">Description</Label>
                            <Textarea
                                id="edit_resp_desc"
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
                                onClick={() => setEditingResponsibility(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Save Responsibility
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingResponsibility !== null}
                onOpenChange={(open) =>
                    !open && setDeletingResponsibility(null)
                }
            >
                <DialogContent className="rounded-2xl border bg-white sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle>Delete Responsibility</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this responsibility?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingResponsibility(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyResponsibility}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PositionShow.layout = {
    breadcrumbs: [
        {
            title: 'Positions',
            href: positionsIndex(),
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
