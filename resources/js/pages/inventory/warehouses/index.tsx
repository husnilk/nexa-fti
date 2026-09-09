import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as warehouseIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/Inventory/WarehouseController';
import Heading from '@/components/heading';
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
import type { Auth, Warehouse, Organization } from '@/types';

interface PageProps {
    auth: Auth;
    warehouses: Warehouse[];
    organizations: Organization[];
}

export default function WarehouseIndex({
    warehouses,
    organizations,
}: PageProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
        null,
    );
    const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        organization_id: '',
        code: '',
        name: '',
        description: '',
        is_active: true,
    });

    const editForm = useForm({
        organization_id: '',
        code: '',
        name: '',
        description: '',
        is_active: true,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store.url(), {
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingWarehouse) {
return;
}

        editForm.patch(update.url(editingWarehouse.id), {
            onSuccess: () => {
                setEditingWarehouse(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingWarehouse) {
return;
}

        router.delete(destroy.url(deletingWarehouse.id), {
            onSuccess: () => setDeletingWarehouse(null),
        });
    };

    const openEdit = (wh: Warehouse) => {
        setEditingWarehouse(wh);
        editForm.setData({
            organization_id: wh.organization_id.toString(),
            code: wh.code,
            name: wh.name,
            description: wh.description || '',
            is_active: !!wh.is_active,
        });
    };

    const filteredWarehouses = warehouses.filter(
        (wh) =>
            wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wh.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Warehouses" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Warehouses"
                        description="Manage storage locations and organizational units."
                    />
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Warehouse
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search warehouses..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Code
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Organization
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="h-12 px-4 text-left text-right align-middle font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWarehouses.map((wh) => (
                                <tr
                                    key={wh.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {wh.code}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {wh.name}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {wh.organization?.name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge
                                            variant={
                                                wh.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {wh.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(wh)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeletingWarehouse(wh)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredWarehouses.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No warehouses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Warehouse</DialogTitle>
                        <DialogDescription>
                            Create a new storage location.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="org">Organization Unit</Label>
                                <Select
                                    onValueChange={(val) =>
                                        createForm.setData('organization_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem key={org.id} value={org.id}>
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        value={createForm.data.code}
                                        onChange={(e) =>
                                            createForm.setData('code', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData('name', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_active"
                                    checked={createForm.data.is_active}
                                    onCheckedChange={(val) =>
                                        createForm.setData('is_active', val)
                                    }
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
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

            {/* Edit Dialog */}
            <Dialog
                open={!!editingWarehouse}
                onOpenChange={() => setEditingWarehouse(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Warehouse</DialogTitle>
                        <DialogDescription>
                            Update the warehouse details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-org">Organization Unit</Label>
                                <Select
                                    value={editForm.data.organization_id}
                                    onValueChange={(val) =>
                                        editForm.setData('organization_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem key={org.id} value={org.id}>
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-code">Code</Label>
                                    <Input
                                        id="edit-code"
                                        value={editForm.data.code}
                                        onChange={(e) =>
                                            editForm.setData('code', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData('name', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Input
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="edit-is_active"
                                    checked={editForm.data.is_active}
                                    onCheckedChange={(val) =>
                                        editForm.setData('is_active', val)
                                    }
                                />
                                <Label htmlFor="edit-is_active">Active</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingWarehouse(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingWarehouse}
                onOpenChange={() => setDeletingWarehouse(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Warehouse</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "
                            {deletingWarehouse?.name}"? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingWarehouse(null)}
                        >
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

WarehouseIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Warehouses',
            href: warehouseIndex(),
        },
    ],
};
