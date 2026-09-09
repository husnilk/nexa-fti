import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, Pencil, Plus, Search, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
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
import { Textarea } from '@/components/ui/textarea';
import { index as employeeRanksIndex } from '@/routes/employee-ranks';
import { index as employeeTypesIndex } from '@/routes/employee-types';
import { index as employeesIndex } from '@/routes/employees';
import { index as employmentContractsIndex } from '@/routes/employment-contracts';
import { index as employmentTypesIndex } from '@/routes/employment-types';
import type { Auth, EmployeeRank } from '@/types';

interface PageProps {
    auth: Auth;
    ranks: EmployeeRank[];
    filters: {
        search?: string;
    };
}

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

export default function EmployeeRankIndex({ ranks, filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [isCreating, setIsCreating] = useState(false);
    const [editingRank, setEditingRank] = useState<EmployeeRank | null>(null);
    const [deletingRank, setDeletingRank] = useState<EmployeeRank | null>(null);

    const mayManage = can(auth, 'hr.manage');

    const form = useForm({
        code: '',
        name: '',
        order: 0,
        description: '',
    });

    const editForm = useForm({
        code: '',
        name: '',
        order: 0,
        description: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/employee-ranks',
            { search },
            { preserveState: true }
        );
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/employee-ranks', {
            onSuccess: () => {
                setIsCreating(false);
                form.reset();
            },
        });
    };

    const handleOpenEdit = (rank: EmployeeRank) => {
        setEditingRank(rank);
        editForm.setData({
            code: rank.code,
            name: rank.name,
            order: rank.order,
            description: rank.description || '',
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingRank) {
return;
}

        editForm.put(`/employee-ranks/${editingRank.id}`, {
            onSuccess: () => {
                setEditingRank(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingRank) {
return;
}

        router.delete(`/employee-ranks/${deletingRank.id}`, {
            onSuccess: () => setDeletingRank(null),
        });
    };

    return (
        <>
            <Head title="Employee Ranks" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={employeesIndex()}>
                            <Button variant="ghost" size="icon" className="cursor-pointer" title="Back to Employees">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Heading
                            title="Employee Ranks"
                            description="Manage employee rank master data (ex. I/a, I/b, Juru Muda, etc.)."
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
                                    <Link href={employmentContractsIndex()} className="w-full cursor-pointer">
                                        Employment Contracts
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={employmentTypesIndex()} className="w-full cursor-pointer">
                                        Employment Types
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {mayManage && (
                            <Button onClick={() => setIsCreating(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Rank
                            </Button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search code or name..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        Search
                    </Button>
                </form>

                <div className="rounded-md border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Code</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Order</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                {mayManage && (
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right w-[120px]">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {ranks.map((rank) => (
                                <tr key={rank.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-mono font-bold text-primary">{rank.code}</td>
                                    <td className="p-4 align-middle font-medium">{rank.name}</td>
                                    <td className="p-4 align-middle">{rank.order}</td>
                                    <td className="p-4 align-middle text-muted-foreground max-w-[300px] truncate">{rank.description || '-'}</td>
                                    {mayManage && (
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenEdit(rank)}
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeletingRank(rank)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {ranks.length === 0 && (
                                <tr>
                                    <td colSpan={mayManage ? 5 : 4} className="p-8 text-center text-muted-foreground italic">
                                        No employee ranks found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={(open) => !open && setIsCreating(false)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Employee Rank</DialogTitle>
                        <DialogDescription>Create a new employee rank master record.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                value={form.data.code}
                                onChange={(e) => form.setData('code', e.target.value)}
                                placeholder="e.g. I/a, IV/e"
                                required
                            />
                            {form.errors.code && <p className="text-xs text-destructive">{form.errors.code}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="e.g. Juru Muda, Pembina Utama"
                                required
                            />
                            {form.errors.name && <p className="text-xs text-destructive">{form.errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="order">Sort Order</Label>
                            <Input
                                id="order"
                                type="number"
                                min="0"
                                value={form.data.order}
                                onChange={(e) => form.setData('order', parseInt(e.target.value) || 0)}
                                required
                            />
                            {form.errors.order && <p className="text-xs text-destructive">{form.errors.order}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                placeholder="Additional details about the rank..."
                            />
                            {form.errors.description && <p className="text-xs text-destructive">{form.errors.description}</p>}
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Save Rank
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editingRank !== null} onOpenChange={(open) => !open && setEditingRank(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Employee Rank</DialogTitle>
                        <DialogDescription>Update employee rank details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_code">Code</Label>
                            <Input
                                id="edit_code"
                                value={editForm.data.code}
                                onChange={(e) => editForm.setData('code', e.target.value)}
                                required
                            />
                            {editForm.errors.code && <p className="text-xs text-destructive">{editForm.errors.code}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_name">Name</Label>
                            <Input
                                id="edit_name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                            />
                            {editForm.errors.name && <p className="text-xs text-destructive">{editForm.errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_order">Sort Order</Label>
                            <Input
                                id="edit_order"
                                type="number"
                                min="0"
                                value={editForm.data.order}
                                onChange={(e) => editForm.setData('order', parseInt(e.target.value) || 0)}
                                required
                            />
                            {editForm.errors.order && <p className="text-xs text-destructive">{editForm.errors.order}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">Description</Label>
                            <Textarea
                                id="edit_description"
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                            />
                            {editForm.errors.description && <p className="text-xs text-destructive">{editForm.errors.description}</p>}
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setEditingRank(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Update Rank
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={deletingRank !== null} onOpenChange={(open) => !open && setDeletingRank(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employee Rank</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete rank "{deletingRank?.name}" ({deletingRank?.code})? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingRank(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EmployeeRankIndex.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Employees', href: employeesIndex() },
        { title: 'Employee Ranks', href: employeeRanksIndex() },
    ],
};
