import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as documentsIndex, show as documentShow } from '@/routes/documents';

type DocumentType = { id: number; name: string };
type Organization = { id: string; name: string; code: string };

type Document = {
    id: string;
    title: string;
    document_no?: string;
    document_type_id: number;
    organisation_id: string;
    publish_status: 'draft' | 'published' | 'archived';
};

type PageProps = {
    document: Document;
    documentTypes: DocumentType[];
    organizations: Organization[];
};

export default function DocumentEdit({ document, documentTypes, organizations }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: document.title,
        document_no: document.document_no || '',
        document_type_id: document.document_type_id.toString(),
        organisation_id: document.organisation_id,
        publish_status: document.publish_status,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(DocumentController.update.url(document.id));
    }

    return (
        <>
            <Head title={`Edit Metadata - ${document.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={documentShow.url(document.id)}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title={`Edit Document Metadata`}
                        description="Modify title, document number, type, organization, and status"
                    />
                </div>

                <form onSubmit={submit} className="mx-auto w-full max-w-2xl grid gap-6">
                    <Card>
                        <CardContent className="pt-6 grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Quality Manual"
                                    required
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="document_no">Document Number</Label>
                                <Input
                                    id="document_no"
                                    value={data.document_no}
                                    onChange={(e) => setData('document_no', e.target.value)}
                                    placeholder="e.g. DOC-2026-001"
                                />
                                {errors.document_no && <p className="text-sm text-destructive">{errors.document_no}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="document_type_id">Document Type</Label>
                                <Select 
                                    value={data.document_type_id} 
                                    onValueChange={(val) => setData('document_type_id', val)}
                                >
                                    <SelectTrigger id="document_type_id">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {documentTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.document_type_id && <p className="text-sm text-destructive">{errors.document_type_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="organisation_id">Organization Unit</Label>
                                <Select 
                                    value={data.organisation_id} 
                                    onValueChange={(val) => setData('organisation_id', val)}
                                >
                                    <SelectTrigger id="organisation_id">
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem key={org.id} value={org.id}>
                                                {org.name} ({org.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.organisation_id && <p className="text-sm text-destructive">{errors.organisation_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="publish_status">Publish Status</Label>
                                <Select 
                                    value={data.publish_status} 
                                    onValueChange={(val: any) => setData('publish_status', val)}
                                >
                                    <SelectTrigger id="publish_status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.publish_status && <p className="text-sm text-destructive">{errors.publish_status}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={documentShow.url(document.id)}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentEdit.layout = {
    breadcrumbs: [
        { title: 'Documents', href: documentsIndex() },
        { title: 'Edit Metadata', href: '#' },
    ],
};
