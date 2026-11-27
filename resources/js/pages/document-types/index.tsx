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
import { __ } from '@/lib/i18n';
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
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Document Types')} />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Document Types')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__('Manage document categories and nomenclatures.')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={documentTypeCreate()}>
                        <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                            <Plus className="h-4 w-4" />{' '}
                            {__('Add Document Type')}
                        </Button>
                    </Link>
                    <Link href={documentsIndex()}>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 font-medium"
                        >
                            <FileText className="h-4 w-4" /> {__('Documents')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="w-[80px] px-6 py-4">ID</th>
                                <th className="w-[220px] px-6 py-4">
                                    {__('Name')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Description')}
                                </th>
                                <th className="w-[120px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {documentTypes.length > 0 ? (
                                documentTypes.map((type) => (
                                    <tr
                                        key={type.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                {type.id}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {type.name}
                                        </td>
                                        <td className="line-clamp-1 px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {type.description || (
                                                <span className="text-muted-foreground italic">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={documentTypeEdit.url(
                                                        type.id,
                                                    )}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Edit')}
                                                        className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    title={__('Delete')}
                                                    onClick={() =>
                                                        setDeletingType(type)
                                                    }
                                                    className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No document types found.')}
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
                        <DialogTitle>{__('Delete Document Type')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__('Are you sure you want to delete document type')}{' '}
                        <strong className="text-foreground not-italic">
                            {deletingType?.name}
                        </strong>
                        ? {__('This will permanently delete it.')}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingType(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyType}
                            className="cursor-pointer"
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

DocumentTypesIndex.layout = {
    breadcrumbs: [
        { title: __('Documents'), href: documentsIndex() },
        { title: __('Document Types'), href: documentTypesIndex() },
    ],
};
