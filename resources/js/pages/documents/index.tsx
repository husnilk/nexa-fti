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
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

export default function DocumentsIndex({ documents = [], documentTypes, filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingDocument, setDeletingDocument] = useState<Document | null>(null);

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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> Published
                </span>
            );
        }

        if (publishStatus === 'archived') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400">
                    <Archive className="h-3 w-3" /> Archived
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400">
                <Edit3 className="h-3 w-3" /> Draft
            </span>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Documents" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Documents
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Access, publish, and search university documents and revisions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {mayCreate && (
                        <Link href={documentCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                                <Plus className="h-4 w-4" /> Add Document
                            </Button>
                        </Link>
                    )}
                    <Link href={documentTypesIndex()}>
                        <Button variant="outline" className="cursor-pointer gap-2 font-medium">
                            <ClipboardList className="h-4 w-4" /> Document Types
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search documents or number..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Types</option>
                        {documentTypes.map((t) => (
                            <option key={t.id} value={t.id.toString()}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Title</th>
                                <th className="py-4 px-6 w-[140px]">Document No.</th>
                                <th className="py-4 px-6">Type</th>
                                <th className="py-4 px-6 w-[120px]">Organization</th>
                                <th className="py-4 px-6 w-[140px]">Active Revision</th>
                                <th className="py-4 px-6 text-center w-[130px]">Status</th>
                                <th className="py-4 px-6 text-right w-[140px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {documents.length > 0 ? (
                                documents.map((doc) => {
                                    const activeRevision = doc.document_revisions?.[0];

                                    return (
                                        <tr
                                            key={doc.id}
                                            className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                                        <FileText className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                                    </div>
                                                    <span
                                                        className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1"
                                                        title={doc.title}
                                                    >
                                                        {doc.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                                    {doc.document_no || '-'}
                                                </code>
                                            </td>
                                            <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                                {doc.document_type.name}
                                            </td>
                                            <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                                <span title={doc.organization.name}>
                                                    {doc.organization.code}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {activeRevision ? (
                                                    <a
                                                        href={`/storage/${activeRevision.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 text-sm font-medium"
                                                    >
                                                        Rev {activeRevision.revision_no}
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-xs">
                                                        No file
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {getStatusBadge(doc.publish_status)}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={documentShow.url(doc.id)}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="View Details"
                                                            className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayUpdate && (
                                                        <Link href={documentEdit.url(doc.id)}>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Edit"
                                                                className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
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
                                                            title="Delete"
                                                            onClick={() => setDeletingDocument(doc)}
                                                            className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
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
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No documents found matching the filters.
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
                        <DialogTitle>Delete Document</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete document{' '}
                        <strong className="text-foreground not-italic">{deletingDocument?.title}</strong>?
                        This will also delete all associated files and revision records.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingDocument(null)}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyDocument}
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

DocumentsIndex.layout = {
    breadcrumbs: [{ title: 'Documents', href: documentsIndex() }],
};
