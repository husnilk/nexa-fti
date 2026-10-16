import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    Pencil,
    Plus,
    Search,
    Settings,
    Trash2,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import EmploymentTypeController from '@/actions/App/Http/Controllers/Acl/EmploymentTypeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { __, intlLocale } from '@/lib/i18n';
import { index as employeeRanksIndex } from '@/routes/employee-ranks';
import { index as employeeTypesIndex } from '@/routes/employee-types';
import { index as employeesIndex } from '@/routes/employees';
import { index as employmentContractsIndex } from '@/routes/employment-contracts';
import { index as employmentTypesIndex } from '@/routes/employment-types';
import type { Auth } from '@/types';

type EmployeeType = {
    id: string;
    name: string;
};

type EmploymentContract = {
    id: number;
    name: string;
};

type EmploymentType = {
    id: string;
    employee_type_id: string;
    employment_contract_id: number;
    remun_status: string;
    employee_type?: EmployeeType;
    employment_contract?: EmploymentContract;
    created_at: string;
};

type EmploymentTypeForm = {
    employee_type_id: string;
    employment_contract_id: string;
    remun_status: string;
};

type PageProps = {
    auth: Auth;
    employmentTypes: EmploymentType[];
    employeeTypes: EmployeeType[];
    employmentContracts: EmploymentContract[];
    filters: {
        search?: string;
    };
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function EmploymentTypeIndex({
    employmentTypes,
    employeeTypes,
    employmentContracts,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingType, setEditingType] = useState<EmploymentType | null>(null);
    const [deletingType, setDeletingType] = useState<EmploymentType | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                employmentTypesIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [debouncedSearch]);

    const createForm = useForm<EmploymentTypeForm>({
        employee_type_id: '',
        employment_contract_id: '',
        remun_status: '',
    });

    const editForm = useForm<EmploymentTypeForm>({
        employee_type_id: '',
        employment_contract_id: '',
        remun_status: '',
    });

    const mayCreate = can(auth, 'employment.manage');

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        createForm.post(EmploymentTypeController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(type: EmploymentType): void {
        setEditingType(type);
        editForm.setData({
            employee_type_id: type.employee_type_id,
            employment_contract_id: type.employment_contract_id.toString(),
            remun_status: type.remun_status,
        });
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingType) {
            return;
        }

        editForm.patch(EmploymentTypeController.update.url(editingType.id), {
            preserveScroll: true,
            onSuccess: () => setEditingType(null),
        });
    }

    function destroyType(): void {
        if (!deletingType) {
            return;
        }

        router.delete(EmploymentTypeController.destroy.url(deletingType.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingType(null),
        });
    }

    return (
        <>
            <Head title={__('Employment Types')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={employeesIndex()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                title={__('Back to Employees')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Heading
                            title={__('Employment Types')}
                            description={__(
                                'Standardized combinations of employee types and contracts',
                            )}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer gap-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    {__('Settings')}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                    {__('HR Configuration')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={employeeTypesIndex()}
                                        className="w-full cursor-pointer"
                                    >
                                        {__('Employee Types')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={employmentContractsIndex()}
                                        className="w-full cursor-pointer"
                                    >
                                        {__('Employment Contracts')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={employeeRanksIndex()}
                                        className="w-full cursor-pointer"
                                    >
                                        {__('Employee Ranks')}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={__('Search...')}
                                className="pr-10 pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {mayCreate && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus /> {__('Add Combination')}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[700px] grid-cols-[1fr_1fr_1fr_140px_100px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>{__('Employee Type')}</span>
                        <span>{__('Contract')}</span>
                        <span>{__('Remun Status')}</span>
                        <span>{__('Created')}</span>
                        <span className="text-right">{__('Actions')}</span>
                    </div>
                    {employmentTypes.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            {__('No employment types defined.')}
                        </div>
                    ) : (
                        <div className="min-w-[700px] divide-y">
                            {employmentTypes.map((type) => (
                                <div
                                    key={type.id}
                                    className="grid grid-cols-[1fr_1fr_1fr_140px_100px] items-center gap-4 px-4 py-3"
                                >
                                    <span className="font-medium">
                                        {type.employee_type?.name ||
                                            __('Unknown')}
                                    </span>
                                    <span className="text-sm">
                                        {type.employment_contract?.name ||
                                            __('Unknown')}
                                    </span>
                                    <span className="text-sm italic">
                                        {type.remun_status}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {dateFormatter.format(
                                            new Date(type.created_at),
                                        )}
                                    </span>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditDialog(type)}
                                        >
                                            <Pencil />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setDeletingType(type)
                                            }
                                        >
                                            <Trash2 />
                                        </Button>
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
                        <DialogTitle>
                            {__('Create Employment Type')}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="employee_type">
                                {__('Employee Type')}
                            </Label>
                            <Select
                                value={createForm.data.employee_type_id}
                                onValueChange={(val) =>
                                    createForm.setData('employee_type_id', val)
                                }
                            >
                                <SelectTrigger id="employee_type">
                                    <SelectValue
                                        placeholder={__('Select type')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {employeeTypes.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={createForm.errors.employee_type_id}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contract">{__('Contract')}</Label>
                            <Select
                                value={createForm.data.employment_contract_id}
                                onValueChange={(val) =>
                                    createForm.setData(
                                        'employment_contract_id',
                                        val,
                                    )
                                }
                            >
                                <SelectTrigger id="contract">
                                    <SelectValue
                                        placeholder={__('Select contract')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {employmentContracts.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={c.id.toString()}
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={
                                    createForm.errors.employment_contract_id
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="remun">{__('Remun Status')}</Label>
                            <Input
                                id="remun"
                                value={createForm.data.remun_status}
                                onChange={(e) =>
                                    createForm.setData(
                                        'remun_status',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={createForm.errors.remun_status}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {__('Save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingType !== null}
                onOpenChange={(open) => !open && setEditingType(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Edit Employment Type')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_employee_type">
                                {__('Employee Type')}
                            </Label>
                            <Select
                                value={editForm.data.employee_type_id}
                                onValueChange={(val) =>
                                    editForm.setData('employee_type_id', val)
                                }
                            >
                                <SelectTrigger id="edit_employee_type">
                                    <SelectValue
                                        placeholder={__('Select type')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {employeeTypes.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={editForm.errors.employee_type_id}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_contract">
                                {__('Contract')}
                            </Label>
                            <Select
                                value={editForm.data.employment_contract_id}
                                onValueChange={(val) =>
                                    editForm.setData(
                                        'employment_contract_id',
                                        val,
                                    )
                                }
                            >
                                <SelectTrigger id="edit_contract">
                                    <SelectValue
                                        placeholder={__('Select contract')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {employmentContracts.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={c.id.toString()}
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={editForm.errors.employment_contract_id}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_remun">
                                {__('Remun Status')}
                            </Label>
                            <Input
                                id="edit_remun"
                                value={editForm.data.remun_status}
                                onChange={(e) =>
                                    editForm.setData(
                                        'remun_status',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={editForm.errors.remun_status}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingType(null)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {__('Save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingType !== null}
                onOpenChange={(open) => !open && setDeletingType(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Delete Employment Type')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        {__(
                            'Are you sure you want to delete this combination?',
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingType(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyType}
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
