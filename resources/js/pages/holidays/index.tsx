import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import {
    CalendarIcon,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
    Eye,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import HolidayController from '@/actions/App/Http/Controllers/Hr/HolidayController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { useDebounce } from '@/hooks/use-debounce';
import {
    index as holidaysIndex,
    show as holidaysShow,
} from '@/routes/holidays';
import type { Auth } from '@/types';

type Holiday = {
    id: string;
    date: string;
    name: string;
};

type PageProps = {
    auth: Auth;
    holidays: Holiday[];
    filters: {
        search?: string;
        year?: string;
    };
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function HolidaysIndex({ holidays, filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
    const [deletingHoliday, setDeletingHoliday] = useState<Holiday | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const [year, setYear] = useState(
        filters.year || new Date().getFullYear().toString(),
    );
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        router.get(
            holidaysIndex(),
            { search: debouncedSearch, year },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, year]);

    const mayCreate = can(auth, 'hr.manage');
    const mayUpdate = can(auth, 'hr.manage');
    const mayDelete = can(auth, 'hr.manage');

    const createForm = useForm({
        date: '',
        name: '',
    });

    const editForm = useForm({
        date: '',
        name: '',
    });

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        createForm.post(HolidayController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(holiday: Holiday): void {
        setEditingHoliday(holiday);
        editForm.setData({
            date: holiday.date.split('T')[0],
            name: holiday.name,
        });
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingHoliday) {
return;
}

        editForm.patch(HolidayController.update.url(editingHoliday.id), {
            preserveScroll: true,
            onSuccess: () => setEditingHoliday(null),
        });
    }

    function destroyHoliday(): void {
        if (!deletingHoliday) {
return;
}

        router.delete(HolidayController.destroy.url(deletingHoliday.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingHoliday(null),
        });
    }

    return (
        <>
            <Head title="Holidays" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Holidays"
                        description="Manage company holidays and non-working days"
                    />
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-4 text-muted-foreground" />
                            <select
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {[...Array(5)].map((_, i) => {
                                    const y = new Date().getFullYear() - 2 + i;

                                    return (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="relative w-full max-w-[200px] md:max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search holidays..."
                                className="h-9 pr-8 pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-2.5 right-2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        {mayCreate && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="h-9"
                            >
                                <Plus className="mr-1 size-4" /> Add Holiday
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[600px] grid-cols-[150px_minmax(200px,1fr)_120px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>Date</span>
                        <span>Holiday Name</span>
                        <span className="text-right">Actions</span>
                    </div>

                    {holidays.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No holidays found for this year.
                        </div>
                    ) : (
                        <div className="min-w-[600px] divide-y">
                            {holidays.map((holiday) => (
                                <div
                                    key={holiday.id}
                                    className="grid grid-cols-[150px_minmax(200px,1fr)_120px] items-center gap-4 px-4 py-3 hover:bg-muted/20"
                                >
                                    <span className="text-sm font-medium">
                                        {new Date(
                                            holiday.date,
                                        ).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span className="font-medium">
                                        {holiday.name}
                                    </span>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            title="View Detail"
                                        >
                                            <Link
                                                href={holidaysShow.url(
                                                    holiday.id,
                                                )}
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </Button>
                                        {mayUpdate && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                title="Edit"
                                                onClick={() =>
                                                    openEditDialog(holiday)
                                                }
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                        )}
                                        {mayDelete && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                title="Delete"
                                                onClick={() =>
                                                    setDeletingHoliday(holiday)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Holiday Modal */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Holiday</DialogTitle>
                        <DialogDescription>
                            Register a new public holiday or non-working day.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create_date">Date</Label>
                            <Input
                                id="create_date"
                                type="date"
                                value={createForm.data.date}
                                onChange={(e) =>
                                    createForm.setData('date', e.target.value)
                                }
                            />
                            <InputError message={createForm.errors.date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create_name">Holiday Name</Label>
                            <Input
                                id="create_name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                                placeholder="e.g. Independence Day"
                            />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <DialogFooter>
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
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Holiday Modal */}
            <Dialog
                open={editingHoliday !== null}
                onOpenChange={(open) => !open && setEditingHoliday(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Holiday</DialogTitle>
                        <DialogDescription>
                            Update holiday information.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_date">Date</Label>
                            <Input
                                id="edit_date"
                                type="date"
                                value={editForm.data.date}
                                onChange={(e) =>
                                    editForm.setData('date', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_name">Holiday Name</Label>
                            <Input
                                id="edit_name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingHoliday(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Holiday Modal */}
            <Dialog
                open={deletingHoliday !== null}
                onOpenChange={(open) => !open && setDeletingHoliday(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Holiday</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground">
                        Are you sure you want to delete the holiday{' '}
                        <span className="font-medium text-foreground">
                            {deletingHoliday?.name}
                        </span>{' '}
                        on{' '}
                        {deletingHoliday
                            ? new Date(
                                  deletingHoliday.date,
                              ).toLocaleDateString()
                            : ''}
                        ?
                        <br />
                        This action cannot be undone.
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingHoliday(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyHoliday}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

HolidaysIndex.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Holidays', href: holidaysIndex() },
    ],
};
