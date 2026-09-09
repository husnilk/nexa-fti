import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, FileText, Pencil, Plus, Search, Settings, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import EmploymentContractController from '@/actions/App/Http/Controllers/Acl/EmploymentContractController';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';
import { index as employeeRanksIndex } from '@/routes/employee-ranks';
import { index as employeeTypesIndex } from '@/routes/employee-types';
import { index as employeesIndex } from '@/routes/employees';
import { index as employmentContractsIndex } from '@/routes/employment-contracts';
import { index as employmentTypesIndex } from '@/routes/employment-types';
import type { Auth } from '@/types';

type EmploymentContract = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
};

type EmploymentContractForm = {
    id: number;
    name: string;
    description: string | null;
};

type PageProps = {
    auth: Auth;
    employmentContracts: EmploymentContract[];
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

export default function EmploymentContractIndex({
    employmentContracts,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingContract, setEditingContract] =
        useState<EmploymentContract | null>(null);
    const [deletingContract, setDeletingContract] =
        useState<EmploymentContract | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                employmentContractsIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [debouncedSearch]);

    const createForm = useForm<EmploymentContractForm>({
        id: 0,
        name: '',
        description: '',
    });

    const editForm = useForm<EmploymentContractForm>({
        id: 0,
        name: '',
        description: '',
    });

    const mayCreate = can(auth, 'employment.manage');
    const mayUpdate = can(auth, 'employment.manage');
    const mayDelete = can(auth, 'employment.manage');

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        createForm.post(EmploymentContractController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(contract: EmploymentContract): void {
        setEditingContract(contract);
        editForm.setData({
            id: contract.id,
            name: contract.name,
            description: contract.description || '',
        });
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingContract) {
return;
}

        editForm.patch(
            EmploymentContractController.update.url(editingContract.id),
            {
                preserveScroll: true,
                onSuccess: () => setEditingContract(null),
            },
        );
    }

    function destroyContract(): void {
        if (!deletingContract) {
return;
}

        router.delete(
            EmploymentContractController.destroy.url(deletingContract.id),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingContract(null),
            },
        );
    }

    return (
        <>
            <Head title="Employment Contracts" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={employeesIndex()}>
                            <Button variant="ghost" size="icon" className="cursor-pointer" title="Back to Employees">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Heading
                            title="Employment Contracts"
                            description="Manage various employment contract types"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="cursor-pointer gap-2">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="text-xs text-muted-foreground font-medium">HR Configuration</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={employeeTypesIndex()} className="w-full cursor-pointer">
                                        Employee Types
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={employmentTypesIndex()} className="w-full cursor-pointer">
                                        Employment Types
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={employeeRanksIndex()} className="w-full cursor-pointer">
                                        Employee Ranks
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pr-10 pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        {mayCreate && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus /> Add Employment Contract
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[600px] grid-cols-[100px_minmax(200px,1fr)_minmax(200px,1fr)_140px_100px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>ID</span>
                        <span>Name</span>
                        <span>Description</span>
                        <span>Created</span>
                        <span className="text-right">Actions</span>
                    </div>
                    {employmentContracts.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No employment contracts found.
                        </div>
                    ) : (
                        <div className="min-w-[600px] divide-y">
                            {employmentContracts.map((contract) => (
                                <div
                                    key={contract.id}
                                    className="grid grid-cols-[100px_minmax(200px,1fr)_minmax(200px,1fr)_140px_100px] items-center gap-4 px-4 py-3"
                                >
                                    <span className="font-mono text-xs">
                                        {contract.id}
                                    </span>
                                    <span className="font-medium">
                                        {contract.name}
                                    </span>
                                    <span className="line-clamp-1 text-sm text-muted-foreground">
                                        {contract.description || '-'}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {dateFormatter.format(
                                            new Date(contract.created_at),
                                        )}
                                    </span>
                                    <div className="flex justify-end gap-1">
                                        {mayUpdate && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditDialog(contract)
                                                }
                                            >
                                                <Pencil />
                                            </Button>
                                        )}
                                        {mayDelete && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeletingContract(
                                                        contract,
                                                    )
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Employment Contract</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="id">ID (Integer)</Label>
                            <Input
                                id="id"
                                type="number"
                                value={createForm.data.id}
                                onChange={(e) =>
                                    createForm.setData(
                                        'id',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                            />
                            <InputError message={createForm.errors.id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={createForm.data.description || ''}
                                onChange={(e) =>
                                    createForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={createForm.errors.description}
                            />
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

            <Dialog
                open={editingContract !== null}
                onOpenChange={(open) => !open && setEditingContract(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employment Contract</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_id">ID (Integer)</Label>
                            <Input
                                id="edit_id"
                                type="number"
                                value={editForm.data.id}
                                onChange={(e) =>
                                    editForm.setData(
                                        'id',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                            />
                            <InputError message={editForm.errors.id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_name">Name</Label>
                            <Input
                                id="edit_name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">
                                Description
                            </Label>
                            <textarea
                                id="edit_description"
                                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={editForm.data.description || ''}
                                onChange={(e) =>
                                    editForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={editForm.errors.description} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingContract(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingContract !== null}
                onOpenChange={(open) => !open && setDeletingContract(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employment Contract</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to delete {deletingContract?.name}
                        ?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingContract(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyContract}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
