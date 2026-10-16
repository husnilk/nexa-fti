import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Calendar,
    FileText,
    CheckCircle,
    Archive,
    Edit3,
    Download,
    User,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import DocumentRevisionController from '@/actions/App/Http/Controllers/DocumentRevisionController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { __, intlLocale } from '@/lib/i18n';
import {
    index as documentsIndex,
    edit as documentEdit,
} from '@/routes/documents';

type Employee = {
    id: string;
    name: string;
    user?: { name: string };
};

type DocumentRevision = {
    id: string;
    revision_no: number;
    revision_date: string;
    doc_date?: number;
    doc_month?: number;
    doc_year?: number;
    active: boolean;
    file_path: string;
    uploaded_by: Employee;
    uploaded_at: string;
};

type Document = {
    id: string;
    title: string;
    document_no?: string;
    publish_status: 'draft' | 'published' | 'archived';
    published_by?: Employee;
    published_at?: string;
    archived_by?: Employee;
    archived_at?: string;
    document_type: { name: string };
    organization: { name: string; code: string };
    document_revisions: DocumentRevision[];
};

type PageProps = {
    document: Document;
};

export default function DocumentShow({ document }: PageProps) {
    const [deletingRevision, setDeletingRevision] =
        useState<DocumentRevision | null>(null);
    const [uploadingRevision, setUploadingRevision] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const { data, setData, post, processing, errors, reset } = useForm({
        document_id: document.id,
        revision_date: today,
        doc_date: '',
        doc_month: '',
        doc_year: '',
        file: null as File | null,
    });

    function handlePublish(): void {
        router.post(
            DocumentController.publish.url(document.id),
            {},
            {
                preserveScroll: true,
            },
        );
    }

    function handleArchive(): void {
        router.post(
            DocumentController.archive.url(document.id),
            {},
            {
                preserveScroll: true,
            },
        );
    }

    function submitRevision(e: FormEvent): void {
        e.preventDefault();
        post(DocumentRevisionController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setUploadingRevision(false);
                reset('doc_date', 'doc_month', 'doc_year', 'file');
            },
        });
    }

    function destroyRevision(): void {
        if (!deletingRevision) {
            return;
        }

        router.delete(
            DocumentRevisionController.destroy.url(deletingRevision.id),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingRevision(null),
            },
        );
    }

    const statusLabels: Record<string, string> = {
        draft: __('Draft'),
        published: __('Published'),
        archived: __('Archived'),
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (
                    <Badge className="gap-1 border-green-500/30 bg-green-500/10 text-green-500 capitalize hover:bg-green-500/10">
                        <CheckCircle className="size-3" />{' '}
                        {statusLabels[status] ?? status}
                    </Badge>
                );
            case 'archived':
                return (
                    <Badge
                        variant="secondary"
                        className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-500 capitalize hover:bg-amber-500/10"
                    >
                        <Archive className="size-3" />{' '}
                        {statusLabels[status] ?? status}
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-500 capitalize hover:bg-blue-500/10"
                    >
                        <Edit3 className="size-3" />{' '}
                        {statusLabels[status] ?? status}
                    </Badge>
                );
        }
    };

    return (
        <>
            <Head title={document.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={documentsIndex()}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={document.title}
                            description={
                                document.document_no || __('No Document Number')
                            }
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {document.publish_status !== 'published' && (
                            <Button
                                onClick={handlePublish}
                                variant="outline"
                                className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                            >
                                <CheckCircle className="mr-2 size-4" />{' '}
                                {__('Publish')}
                            </Button>
                        )}
                        {document.publish_status === 'published' && (
                            <Button
                                onClick={handleArchive}
                                variant="outline"
                                className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                            >
                                <Archive className="mr-2 size-4" />{' '}
                                {__('Archive')}
                            </Button>
                        )}
                        <Button asChild variant="outline">
                            <Link href={documentEdit.url(document.id)}>
                                <Edit3 className="mr-2 size-4" />{' '}
                                {__('Edit Metadata')}
                            </Link>
                        </Button>
                        <Button onClick={() => setUploadingRevision(true)}>
                            <Plus className="mr-2 size-4" />{' '}
                            {__('Upload Revision')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {__('Revision History')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                                    <div className="grid grid-cols-[80px_120px_120px_1fr_100px_90px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                                        <span>{__('Rev.')}</span>
                                        <span>{__('Rev. Date')}</span>
                                        <span>{__('Doc. Date')}</span>
                                        <span>{__('Uploaded By')}</span>
                                        <span>{__('Active')}</span>
                                        <span className="text-right">
                                            {__('Actions')}
                                        </span>
                                    </div>

                                    {document.document_revisions.length ===
                                    0 ? (
                                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                                            {__('No revisions uploaded yet.')}
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {document.document_revisions.map(
                                                (rev) => (
                                                    <div
                                                        key={rev.id}
                                                        className="grid grid-cols-[80px_120px_120px_1fr_100px_90px] items-center gap-4 px-4 py-3"
                                                    >
                                                        <span className="font-semibold">
                                                            v{rev.revision_no}
                                                        </span>
                                                        <span className="text-sm">
                                                            {rev.revision_date}
                                                        </span>
                                                        <span className="font-mono text-sm">
                                                            {rev.doc_date &&
                                                            rev.doc_month &&
                                                            rev.doc_year
                                                                ? `${rev.doc_date}/${rev.doc_month}/${rev.doc_year}`
                                                                : '-'}
                                                        </span>
                                                        <span className="line-clamp-1 text-sm">
                                                            {rev.uploaded_by
                                                                ?.name ||
                                                                __('Unknown')}
                                                        </span>
                                                        <div>
                                                            {rev.active ? (
                                                                <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/10">
                                                                    {__(
                                                                        'Active',
                                                                    )}
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary">
                                                                    {__(
                                                                        'Inactive',
                                                                    )}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="icon"
                                                                title={__(
                                                                    'Download',
                                                                )}
                                                            >
                                                                <a
                                                                    href={`/storage/${rev.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Download className="size-4" />
                                                                </a>
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                title={__(
                                                                    'Delete Revision',
                                                                )}
                                                                onClick={() =>
                                                                    setDeletingRevision(
                                                                        rev,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid h-fit gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {__('Metadata')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm">
                                <div className="grid gap-1">
                                    <span className="text-xs text-muted-foreground">
                                        {__('Status')}
                                    </span>
                                    <div>
                                        {getStatusBadge(
                                            document.publish_status,
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-1">
                                    <span className="text-xs text-muted-foreground">
                                        {__('Document Type')}
                                    </span>
                                    <span className="font-medium">
                                        {document.document_type.name}
                                    </span>
                                </div>

                                <div className="grid gap-1">
                                    <span className="text-xs text-muted-foreground">
                                        {__('Organization Unit')}
                                    </span>
                                    <span className="font-medium">
                                        {document.organization.name} (
                                        {document.organization.code})
                                    </span>
                                </div>

                                <div className="grid gap-2 border-t pt-3">
                                    {document.published_by && (
                                        <div className="grid gap-1">
                                            <span className="text-xs text-muted-foreground">
                                                {__('Published By')}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 font-medium">
                                                <User className="size-3.5 text-muted-foreground" />{' '}
                                                {document.published_by.name}
                                            </span>
                                            {document.published_at && (
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {new Date(
                                                        document.published_at,
                                                    ).toLocaleString(
                                                        intlLocale(),
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {document.archived_by && (
                                        <div className="mt-2 grid gap-1">
                                            <span className="text-xs text-muted-foreground">
                                                {__('Archived By')}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 font-medium">
                                                <User className="size-3.5 text-muted-foreground" />{' '}
                                                {document.archived_by.name}
                                            </span>
                                            {document.archived_at && (
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {new Date(
                                                        document.archived_at,
                                                    ).toLocaleString(
                                                        intlLocale(),
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog
                open={uploadingRevision}
                onOpenChange={setUploadingRevision}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Upload New Revision')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitRevision} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rev_file">{__('File')}</Label>
                            <Input
                                id="rev_file"
                                type="file"
                                onChange={(e) =>
                                    setData('file', e.target.files?.[0] || null)
                                }
                                required
                            />
                            {errors.file && (
                                <p className="text-sm text-destructive">
                                    {errors.file}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rev_date">
                                {__('Revision Date')}
                            </Label>
                            <Input
                                id="rev_date"
                                type="date"
                                value={data.revision_date}
                                onChange={(e) =>
                                    setData('revision_date', e.target.value)
                                }
                                required
                            />
                            {errors.revision_date && (
                                <p className="text-sm text-destructive">
                                    {errors.revision_date}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="rev_doc_date">
                                    {__('Day')}
                                </Label>
                                <Input
                                    id="rev_doc_date"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={data.doc_date}
                                    onChange={(e) =>
                                        setData('doc_date', e.target.value)
                                    }
                                />
                                {errors.doc_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.doc_date}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rev_doc_month">
                                    {__('Month')}
                                </Label>
                                <Input
                                    id="rev_doc_month"
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={data.doc_month}
                                    onChange={(e) =>
                                        setData('doc_month', e.target.value)
                                    }
                                />
                                {errors.doc_month && (
                                    <p className="text-sm text-destructive">
                                        {errors.doc_month}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rev_doc_year">
                                    {__('Year')}
                                </Label>
                                <Input
                                    id="rev_doc_year"
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    value={data.doc_year}
                                    onChange={(e) =>
                                        setData('doc_year', e.target.value)
                                    }
                                />
                                {errors.doc_year && (
                                    <p className="text-sm text-destructive">
                                        {errors.doc_year}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUploadingRevision(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {__('Upload')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingRevision !== null}
                onOpenChange={(open) => !open && setDeletingRevision(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Revision')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        {__('Are you sure you want to delete revision')}{' '}
                        <strong className="text-foreground">
                            v{deletingRevision?.revision_no}
                        </strong>
                        ?{' '}
                        {__(
                            'This will permanently delete the file from storage.',
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingRevision(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyRevision}
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DocumentShow.layout = {
    breadcrumbs: [
        { title: __('Documents'), href: documentsIndex() },
        { title: __('Details'), href: '#' },
    ],
};
