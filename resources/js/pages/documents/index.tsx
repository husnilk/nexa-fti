import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Archive,
    CheckCircle,
    ClipboardList,
    Edit3,
    Eye,
    FileText,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { __ } from '@/lib/i18n';
import { index as documentTypesIndex } from '@/routes/document-types';
import {
    index as documentsIndex,
    create as documentCreate,
    edit as documentEdit,
    show as documentShow,
} from '@/routes/documents';
import type { Auth } from '@/types';

type DocumentRevision = {
    id: string;
    revision_no: number;
    file_path: string;
    active: boolean;
};

type Document = {
    id: string;
    title: string;
    document_no?: string;
    publish_status: 'draft' | 'published' | 'archived';
    document_type: { name: string };
    organization: { name: string; code: string };
    document_revisions: DocumentRevision[];
};

type DocumentType = {
    id: number;
    name: string;
};

type PageProps = {
    auth: Auth;
    documents: Document[];
    documentTypes: DocumentType[];
    filters: {
        search?: string;
        status?: string;
        type?: string;
    };
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function DocumentsIndex({
    documents = [],
    documentTypes,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingDocument, setDeletingDocument] = useState<Document | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [type, setType] = useState(filters.type || 'all');

    const debouncedSearch = useDebounce(search, 500);

    const mayCreate = can(auth, 'document.manage');
    const mayUpdate = can(auth, 'document.manage');
    const mayDelete = can(auth, 'document.manage');

    useEffect(() => {
        const query: Record<string, string> = {};

        if (debouncedSearch) {
            query.search = debouncedSearch;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (type && type !== 'all') {
            query.type = type;
        }

        router.get(documentsIndex(), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [debouncedSearch, status, type]);

    function destroyDocument(): void {
        if (!deletingDocument) {
            return;
        }

        router.delete(DocumentController.destroy.url(deletingDocument.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingDocument(null),
        });
    }

    function getStatusBadge(publishStatus: string) {
        if (publishStatus === 'published') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> {__('Published')}
                </span>
            );
        }

        if (publishStatus === 'archived') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/35 dark:text-amber-400">
                    <Archive className="h-3 w-3" /> {__('Archived')}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/35 dark:text-blue-400">
                <Edit3 className="h-3 w-3" /> {__('Draft')}
            </span>
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Documents')} />

            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Documents')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Access, publish, and search university documents and revisions.',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {mayCreate && (
                        <Link href={documentCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                                <Plus className="h-4 w-4" />{' '}
                                {__('Add Document')}
                            </Button>
                        </Link>
                    )}
                    <Link href={documentTypesIndex()}>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 font-medium"
                        >
                            <ClipboardList className="h-4 w-4" />{' '}
                            {__('Document Types')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search documents or number...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Statuses')}</option>
                        <option value="draft">{__('Draft')}</option>
                        <option value="published">{__('Published')}</option>
                        <option value="archived">{__('Archived')}</option>
                    </select>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Types')}</option>
                        {documentTypes.map((t) => (
                            <option key={t.id} value={t.id.toString()}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Title')}</th>
                                <th className="w-[140px] px-6 py-4">
                                    {__('Document No.')}
                                </th>
                                <th className="px-6 py-4">{__('Type')}</th>
                                <th className="w-[120px] px-6 py-4">
                                    {__('Organization')}
                                </th>
                                <th className="w-[140px] px-6 py-4">
                                    {__('Active Revision')}
                                </th>
                                <th className="w-[130px] px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="w-[140px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {documents.length > 0 ? (
                                documents.map((doc) => {
                                    const activeRevision =
                                        doc.document_revisions?.[0];

                                    return (
                                        <tr
                                            key={doc.id}
                                            className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                                                        <FileText className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                                    </div>
                                                    <span
                                                        className="line-clamp-1 font-semibold text-zinc-900 dark:text-zinc-50"
                                                        title={doc.title}
                                                    >
                                                        {doc.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                    {doc.document_no || '-'}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {doc.document_type.name}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                                <span
                                                    title={
                                                        doc.organization.name
                                                    }
                                                >
                                                    {doc.organization.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {activeRevision ? (
                                                    <a
                                                        href={`/storage/${activeRevision.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        {__('Rev :number', {
                                                            number: activeRevision.revision_no,
                                                        })}
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        {__('No file')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(
                                                    doc.publish_status,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={documentShow.url(
                                                            doc.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={__(
                                                                'View Details',
                                                            )}
                                                            className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayUpdate && (
                                                        <Link
                                                            href={documentEdit.url(
                                                                doc.id,
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title={__(
                                                                    'Edit',
                                                                )}
                                                                className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {mayDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            title={__('Delete')}
                                                            onClick={() =>
                                                                setDeletingDocument(
                                                                    doc,
                                                                )
                                                            }
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No documents found matching the filters.',
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Dialog */}
            <Dialog
                open={deletingDocument !== null}
                onOpenChange={(open) => !open && setDeletingDocument(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Document')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__('Are you sure you want to delete document')}{' '}
                        <strong className="text-foreground not-italic">
                            {deletingDocument?.title}
                        </strong>
                        ?{' '}
                        {__(
                            'This will also delete all associated files and revision records.',
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingDocument(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyDocument}
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

DocumentsIndex.layout = {
    breadcrumbs: [{ title: __('Documents'), href: documentsIndex() }],
};
