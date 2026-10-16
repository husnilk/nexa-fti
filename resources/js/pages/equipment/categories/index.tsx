import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as categoryIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentCategoryController';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import type { Auth, EquipmentCategory } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentCategories: EquipmentCategory[];
}

export default function EquipmentCategoryIndex({
    equipmentCategories = [],
}: PageProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<EquipmentCategory | null>(null);
    const [deletingCategory, setDeletingCategory] =
        useState<EquipmentCategory | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        code: '',
        name: '',
        description: '',
    });

    const editForm = useForm({
        code: '',
        name: '',
        description: '',
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

        if (!editingCategory) {
            return;
        }

        editForm.patch(update.url(editingCategory.id), {
            onSuccess: () => {
                setEditingCategory(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingCategory) {
            return;
        }

        router.delete(destroy.url(deletingCategory.id), {
            onSuccess: () => setDeletingCategory(null),
        });
    };

    const openEdit = (category: EquipmentCategory) => {
        setEditingCategory(category);
        editForm.setData({
            code: category.code,
            name: category.name,
            description: category.description || '',
        });
    };

    const filteredCategories = equipmentCategories.filter(
        (cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title={__('Equipment Categories')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={__('Equipment Categories')}
                        description={__(
                            'Manage categories for equipment classification.',
                        )}
                    />
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {__('Add Category')}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={__('Search categories...')}
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
                                    {__('Code')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Name')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Description')}
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {cat.code}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {cat.name}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {cat.description || '-'}
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(cat)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeletingCategory(cat)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        {__('No categories found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{__('Add New Category')}</DialogTitle>
                        <DialogDescription>
                            {__('Create a new category for equipment.')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">{__('Code')}</Label>
                                <Input
                                    id="code"
                                    value={createForm.data.code}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'code',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.code && (
                                    <div className="text-sm text-destructive">
                                        {createForm.errors.code}
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">{__('Name')}</Label>
                                <Input
                                    id="name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.name && (
                                    <div className="text-sm text-destructive">
                                        {createForm.errors.name}
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">
                                    {__('Description')}
                                </Label>
                                <Textarea
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                                {createForm.errors.description && (
                                    <div className="text-sm text-destructive">
                                        {createForm.errors.description}
                                    </div>
                                )}
                            </div>
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

            {/* Edit Dialog */}
            <Dialog
                open={!!editingCategory}
                onOpenChange={() => setEditingCategory(null)}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{__('Edit Category')}</DialogTitle>
                        <DialogDescription>
                            {__('Update the category details.')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-code">{__('Code')}</Label>
                                <Input
                                    id="edit-code"
                                    value={editForm.data.code}
                                    onChange={(e) =>
                                        editForm.setData('code', e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.code && (
                                    <div className="text-sm text-destructive">
                                        {editForm.errors.code}
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">{__('Name')}</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.name && (
                                    <div className="text-sm text-destructive">
                                        {editForm.errors.name}
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">
                                    {__('Description')}
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.description && (
                                    <div className="text-sm text-destructive">
                                        {editForm.errors.description}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingCategory(null)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {__('Update')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingCategory}
                onOpenChange={() => setDeletingCategory(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Category')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Are you sure you want to delete ":name"? This action cannot be undone.',
                                { name: deletingCategory?.name ?? '' },
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingCategory(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentCategoryIndex.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Categories'), href: categoryIndex() },
    ],
};
