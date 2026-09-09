import { Head, Link, router } from '@inertiajs/react';
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DocumentTypeController from '@/actions/App/Http/Controllers/DocumentTypeController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    index as documentTypesIndex,
    create as documentTypeCreate,
    edit as documentTypeEdit,
} from '@/routes/document-types';
import { index as documentsIndex } from '@/routes/documents';

type DocumentType = {
    id: number;
    name: string;
    description: string;
};

type PageProps = {
    documentTypes: DocumentType[];
};

export default function DocumentTypesIndex({ documentTypes }: PageProps) {
    const [deletingType, setDeletingType] = useState<DocumentType | null>(null);

    function destroyType(): void {
        if (!deletingType) {
            return;
        }

        router.delete(DocumentTypeController.destroy.url(deletingType.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingType(null),
        });
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Document Types" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Document Types
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage document categories and nomenclatures.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={documentTypeCreate()}>
                        <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                            <Plus className="h-4 w-4" /> Add Document Type
                        </Button>
                    </Link>
                    <Link href={documentsIndex()}>
                        <Button variant="outline" className="cursor-pointer gap-2 font-medium">
                            <FileText className="h-4 w-4" /> Documents
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6 w-[80px]">ID</th>
                                <th className="py-4 px-6 w-[220px]">Name</th>
                                <th className="py-4 px-6">Description</th>
                                <th className="py-4 px-6 text-right w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {documentTypes.length > 0 ? (
                                documentTypes.map((type) => (
                                    <tr
                                        key={type.id}
                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
                                                {type.id}
                                            </code>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {type.name}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 line-clamp-1">
                                            {type.description || (
                                                <span className="italic text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={documentTypeEdit.url(type.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Edit"
                                                        className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete"
                                                    onClick={() => setDeletingType(type)}
                                                    className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                        No document types found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Dialog */}
            <Dialog
                open={deletingType !== null}
                onOpenChange={(open) => !open && setDeletingType(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document Type</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete document type{' '}
                        <strong className="text-foreground not-italic">{deletingType?.name}</strong>?
                        This will permanently delete it.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingType(null)}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyType}
                            className="cursor-pointer"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

DocumentTypesIndex.layout = {
    breadcrumbs: [
        { title: 'Documents', href: documentsIndex() },
        { title: 'Document Types', href: documentTypesIndex() },
    ],
};
