import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    ChevronRight,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import PositionNomenclatureClassificationController from '@/actions/App/Http/Controllers/Acl/PositionNomenclatureClassificationController';
import PositionNomenclatureResponsibilityController from '@/actions/App/Http/Controllers/Acl/PositionNomenclatureResponsibilityController';
import Heading from '@/components/heading';
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
    index as nomenclaturesIndex,
    show as nomenclatureShow,
} from '@/routes/position-nomenclatures';
import type { Auth } from '@/types';

type Responsibility = {
    id: string;
    position_nomenclature_id: string;
    name: string;
    created_at: string;
};

type Classification = {
    id: string;
    position_nomenclature_id: string;
    name: string;
    description: string | null;
    created_at: string;
};

type PositionNomenclature = {
    id: string;
    name: string;
    grade: number;
    qualification: string | null;
    responsibilities?: Responsibility[];
    classifications?: Classification[];
    created_at: string;
};

type ResponsibilityForm = {
    position_nomenclature_id: string;
    name: string;
};

type ClassificationForm = {
    position_nomenclature_id: string;
    name: string;
    description: string | null;
};

type PageProps = {
    auth: Auth;
    nomenclature: PositionNomenclature;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
});

export default function PositionNomenclatureShow({ nomenclature }: PageProps) {
    const [isCreatingResponsibility, setIsCreatingResponsibility] =
        useState(false);
    const [editingResponsibility, setEditingResponsibility] =
        useState<Responsibility | null>(null);
    const [deletingResponsibility, setDeletingResponsibility] =
        useState<Responsibility | null>(null);

    const [isCreatingClassification, setIsCreatingClassification] =
        useState(false);
    const [editingClassification, setEditingClassification] =
        useState<Classification | null>(null);
    const [deletingClassification, setDeletingClassification] =
        useState<Classification | null>(null);

    const respCreateForm = useForm<ResponsibilityForm>({
        position_nomenclature_id: nomenclature.id,
        name: '',
    });

    const respEditForm = useForm<ResponsibilityForm>({
        position_nomenclature_id: nomenclature.id,
        name: '',
    });

    const classCreateForm = useForm<ClassificationForm>({
        position_nomenclature_id: nomenclature.id,
        name: '',
        description: '',
    });

    const classEditForm = useForm<ClassificationForm>({
        position_nomenclature_id: nomenclature.id,
        name: '',
        description: '',
    });

    // Responsibility actions
    function submitCreateResponsibility(e: FormEvent) {
        e.preventDefault();
        respCreateForm.post(
            PositionNomenclatureResponsibilityController.store.url(),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreatingResponsibility(false);
                    respCreateForm.reset();
                },
            },
        );
    }

    function openEditResponsibility(resp: Responsibility) {
        setEditingResponsibility(resp);
        respEditForm.setData({
            position_nomenclature_id: resp.position_nomenclature_id,
            name: resp.name,
        });
        respEditForm.clearErrors();
    }

    function submitEditResponsibility(e: FormEvent) {
        e.preventDefault();

        if (!editingResponsibility) {
return;
}

        respEditForm.patch(
            PositionNomenclatureResponsibilityController.update.url(
                editingResponsibility.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setEditingResponsibility(null),
            },
        );
    }

    function destroyResponsibility() {
        if (!deletingResponsibility) {
return;
}

        router.delete(
            PositionNomenclatureResponsibilityController.destroy.url(
                deletingResponsibility.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingResponsibility(null),
            },
        );
    }

    // Classification actions
    function submitCreateClassification(e: FormEvent) {
        e.preventDefault();
        classCreateForm.post(
            PositionNomenclatureClassificationController.store.url(),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreatingClassification(false);
                    classCreateForm.reset();
                },
            },
        );
    }

    function openEditClassification(cl: Classification) {
        setEditingClassification(cl);
        classEditForm.setData({
            position_nomenclature_id: cl.position_nomenclature_id,
            name: cl.name,
            description: cl.description || '',
        });
        classEditForm.clearErrors();
    }

    function submitEditClassification(e: FormEvent) {
        e.preventDefault();

        if (!editingClassification) {
return;
}

        classEditForm.patch(
            PositionNomenclatureClassificationController.update.url(
                editingClassification.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setEditingClassification(null),
            },
        );
    }

    function destroyClassification() {
        if (!deletingClassification) {
return;
}

        router.delete(
            PositionNomenclatureClassificationController.destroy.url(
                deletingClassification.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingClassification(null),
            },
        );
    }

    return (
        <>
            <Head title={`Nomenclature: ${nomenclature.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={nomenclaturesIndex()}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Nomenclatures
                        </Link>
                        <Heading
                            title={nomenclature.name}
                            description="Nomenclature details, duties, and classifications"
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-lg border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <BookOpen className="size-5" />
                                General Info
                            </h3>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 border-b pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Grade
                                    </span>
                                    <span className="font-mono text-sm">
                                        {nomenclature.grade}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1 border-b pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Qualification
                                    </span>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {nomenclature.qualification || '-'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Created
                                    </span>
                                    <span className="text-sm">
                                        {dateFormatter.format(
                                            new Date(nomenclature.created_at),
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Classifications
                                </h3>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        setIsCreatingClassification(true)
                                    }
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                            <div className="divide-y">
                                {nomenclature.classifications &&
                                nomenclature.classifications.length > 0 ? (
                                    nomenclature.classifications.map((cl) => (
                                        <div key={cl.id} className="group py-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {cl.name}
                                                    </span>
                                                    {cl.description && (
                                                        <span className="line-clamp-1 text-xs text-muted-foreground">
                                                            {cl.description}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                        onClick={() =>
                                                            openEditClassification(
                                                                cl,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7 text-destructive"
                                                        onClick={() =>
                                                            setDeletingClassification(
                                                                cl,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span className="block py-4 text-center text-sm text-muted-foreground italic">
                                        No classifications.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-primary">
                                    Key Responsibilities / Duties
                                </h3>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        setIsCreatingResponsibility(true)
                                    }
                                >
                                    <Plus className="mr-1 size-4" />
                                    Add Duty
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {nomenclature.responsibilities &&
                                nomenclature.responsibilities.length > 0 ? (
                                    nomenclature.responsibilities.map(
                                        (resp) => (
                                            <div
                                                key={resp.id}
                                                className="group relative flex items-center justify-between rounded-r-md border-l-4 border-primary/20 bg-muted/30 p-3 transition-all hover:border-primary"
                                            >
                                                <span className="text-sm font-medium">
                                                    {resp.name}
                                                </span>
                                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() =>
                                                            openEditResponsibility(
                                                                resp,
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
                                                                resp,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground">
                                        No responsibilities defined.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsibility Dialogs */}
            <Dialog
                open={isCreatingResponsibility}
                onOpenChange={setIsCreatingResponsibility}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Responsibility</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={submitCreateResponsibility}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="resp_name">
                                Duty / Responsibility Name
                            </Label>
                            <Input
                                id="resp_name"
                                value={respCreateForm.data.name}
                                onChange={(e) =>
                                    respCreateForm.setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. Design system architecture"
                            />
                            <InputError message={respCreateForm.errors.name} />
                        </div>
                        <DialogFooter>
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
                                disabled={respCreateForm.processing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingResponsibility !== null}
                onOpenChange={(open) => !open && setEditingResponsibility(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Responsibility</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={submitEditResponsibility}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="edit_resp_name">Duty Name</Label>
                            <Input
                                id="edit_resp_name"
                                value={respEditForm.data.name}
                                onChange={(e) =>
                                    respEditForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={respEditForm.errors.name} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingResponsibility(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={respEditForm.processing}
                            >
                                Save
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Responsibility</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this duty?
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

            {/* Classification Dialogs */}
            <Dialog
                open={isCreatingClassification}
                onOpenChange={setIsCreatingClassification}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Classification</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={submitCreateClassification}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="class_name">
                                Classification Name
                            </Label>
                            <Input
                                id="class_name"
                                value={classCreateForm.data.name}
                                onChange={(e) =>
                                    classCreateForm.setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. Technical"
                            />
                            <InputError message={classCreateForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="class_desc">Description</Label>
                            <textarea
                                id="class_desc"
                                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={classCreateForm.data.description || ''}
                                onChange={(e) =>
                                    classCreateForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={classCreateForm.errors.description}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setIsCreatingClassification(false)
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={classCreateForm.processing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingClassification !== null}
                onOpenChange={(open) => !open && setEditingClassification(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Classification</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={submitEditClassification}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="edit_class_name">Name</Label>
                            <Input
                                id="edit_class_name"
                                value={classEditForm.data.name}
                                onChange={(e) =>
                                    classEditForm.setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={classEditForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_class_desc">Description</Label>
                            <textarea
                                id="edit_class_desc"
                                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={classEditForm.data.description || ''}
                                onChange={(e) =>
                                    classEditForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={classEditForm.errors.description}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingClassification(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={classEditForm.processing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingClassification !== null}
                onOpenChange={(open) =>
                    !open && setDeletingClassification(null)
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Classification</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this classification?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingClassification(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyClassification}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PositionNomenclatureShow.layout = {
    breadcrumbs: [
        {
            title: 'Position Nomenclatures',
            href: nomenclaturesIndex(),
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
