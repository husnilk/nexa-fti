import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import type { FormEvent } from 'react';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as documentsIndex } from '@/routes/documents';

type DocumentType = { id: number; name: string };
type Organization = { id: string; name: string; code: string };

type PageProps = {
    documentTypes: DocumentType[];
    organizations: Organization[];
};

export default function DocumentCreate({ documentTypes, organizations }: PageProps) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        document_no: '',
        document_type_id: '',
        organisation_id: '',
        publish_status: 'draft',
        file: null as File | null,
        revision_date: today,
        doc_date: '',
        doc_month: '',
        doc_year: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(DocumentController.store.url());
    }

    return (
        <>
            <Head title="Add Document" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={documentsIndex()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="Add Document"
                        description="Register a new document and upload its initial revision"
                    />
                </div>

                <form onSubmit={submit} className="mx-auto w-full max-w-4xl grid gap-6 md:grid-cols-2">
                    <Card className="h-fit">
                        <CardContent className="pt-6 grid gap-6">
                            <h3 className="text-lg font-semibold">Document Details</h3>
                            
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

                    <div className="grid gap-6">
                        <Card>
                            <CardContent className="pt-6 grid gap-6">
                                <h3 className="text-lg font-semibold">Initial Revision & File</h3>
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="file">Upload Document File</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60 border-muted-foreground/20">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">PDF, Word, Excel, ZIP (Max 20MB)</p>
                                            </div>
                                            <input 
                                                id="file" 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                            />
                                        </label>
                                    </div>
                                    {data.file && (
                                        <div className="p-2 border rounded bg-muted/20 text-xs flex items-center justify-between">
                                            <span className="font-medium truncate max-w-[250px]">{data.file.name}</span>
                                            <span className="text-muted-foreground">{(data.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    )}
                                    {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="revision_date">Revision Date</Label>
                                    <Input
                                        id="revision_date"
                                        type="date"
                                        value={data.revision_date}
                                        onChange={(e) => setData('revision_date', e.target.value)}
                                        required={!!data.file}
                                    />
                                    {errors.revision_date && <p className="text-sm text-destructive">{errors.revision_date}</p>}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="doc_date">Doc Day (1-31)</Label>
                                        <Input
                                            id="doc_date"
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={data.doc_date}
                                            onChange={(e) => setData('doc_date', e.target.value)}
                                        />
                                        {errors.doc_date && <p className="text-sm text-destructive">{errors.doc_date}</p>}
                                    </div>
                                    
                                    <div className="grid gap-2">
                                        <Label htmlFor="doc_month">Doc Month (1-12)</Label>
                                        <Input
                                            id="doc_month"
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={data.doc_month}
                                            onChange={(e) => setData('doc_month', e.target.value)}
                                        />
                                        {errors.doc_month && <p className="text-sm text-destructive">{errors.doc_month}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="doc_year">Doc Year</Label>
                                        <Input
                                            id="doc_year"
                                            type="number"
                                            min="1900"
                                            max="2100"
                                            value={data.doc_year}
                                            onChange={(e) => setData('doc_year', e.target.value)}
                                        />
                                        {errors.doc_year && <p className="text-sm text-destructive">{errors.doc_year}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href={documentsIndex()}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 size-4" /> Save Document
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentCreate.layout = {
    breadcrumbs: [
        { title: 'Documents', href: documentsIndex() },
        { title: 'Add', href: '#' },
    ],
};
