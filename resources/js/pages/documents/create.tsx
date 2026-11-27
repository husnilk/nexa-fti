import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import type { FormEvent } from 'react';
import DocumentController from '@/actions/App/Http/Controllers/DocumentController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { __ } from '@/lib/i18n';
import { index as documentsIndex } from '@/routes/documents';

type DocumentType = { id: number; name: string };
type Organization = { id: string; name: string; code: string };

type PageProps = {
    documentTypes: DocumentType[];
    organizations: Organization[];
};

export default function DocumentCreate({
    documentTypes,
    organizations,
}: PageProps) {
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
            <Head title={__('Add Document')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={documentsIndex()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title={__('Add Document')}
                        description={__(
                            'Register a new document and upload its initial revision',
                        )}
                    />
                </div>

                <form
                    onSubmit={submit}
                    className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2"
                >
                    <Card className="h-fit">
                        <CardContent className="grid gap-6 pt-6">
                            <h3 className="text-lg font-semibold">
                                {__('Document Details')}
                            </h3>

                            <div className="grid gap-2">
                                <Label htmlFor="title">{__('Title')}</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder={__('e.g. Quality Manual')}
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="document_no">
                                    {__('Document Number')}
                                </Label>
                                <Input
                                    id="document_no"
                                    value={data.document_no}
                                    onChange={(e) =>
                                        setData('document_no', e.target.value)
                                    }
                                    placeholder={__('e.g. DOC-2026-001')}
                                />
                                {errors.document_no && (
                                    <p className="text-sm text-destructive">
                                        {errors.document_no}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="document_type_id">
                                    {__('Document Type')}
                                </Label>
                                <Select
                                    value={data.document_type_id}
                                    onValueChange={(val) =>
                                        setData('document_type_id', val)
                                    }
                                >
                                    <SelectTrigger id="document_type_id">
                                        <SelectValue
                                            placeholder={__('Select type')}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {documentTypes.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={type.id.toString()}
                                            >
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.document_type_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.document_type_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="organisation_id">
                                    {__('Organization Unit')}
                                </Label>
                                <Select
                                    value={data.organisation_id}
                                    onValueChange={(val) =>
                                        setData('organisation_id', val)
                                    }
                                >
                                    <SelectTrigger id="organisation_id">
                                        <SelectValue
                                            placeholder={__(
                                                'Select organization',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={org.id}
                                            >
                                                {org.name} ({org.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.organisation_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.organisation_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="publish_status">
                                    {__('Publish Status')}
                                </Label>
                                <Select
                                    value={data.publish_status}
                                    onValueChange={(val: any) =>
                                        setData('publish_status', val)
                                    }
                                >
                                    <SelectTrigger id="publish_status">
                                        <SelectValue
                                            placeholder={__('Select status')}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            {__('Draft')}
                                        </SelectItem>
                                        <SelectItem value="published">
                                            {__('Published')}
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            {__('Archived')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.publish_status && (
                                    <p className="text-sm text-destructive">
                                        {errors.publish_status}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6">
                        <Card>
                            <CardContent className="grid gap-6 pt-6">
                                <h3 className="text-lg font-semibold">
                                    {__('Initial Revision & File')}
                                </h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="file">
                                        {__('Upload Document File')}
                                    </Label>
                                    <div className="flex w-full items-center justify-center">
                                        <label
                                            htmlFor="file"
                                            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/40 hover:bg-muted/60"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">
                                                        {__('Click to upload')}
                                                    </span>{' '}
                                                    {__('or drag and drop')}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {__(
                                                        'PDF, Word, Excel, ZIP (Max 20MB)',
                                                    )}
                                                </p>
                                            </div>
                                            <input
                                                id="file"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) =>
                                                    setData(
                                                        'file',
                                                        e.target.files?.[0] ||
                                                            null,
                                                    )
                                                }
                                            />
                                        </label>
                                    </div>
                                    {data.file && (
                                        <div className="flex items-center justify-between rounded border bg-muted/20 p-2 text-xs">
                                            <span className="max-w-[250px] truncate font-medium">
                                                {data.file.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {(
                                                    data.file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB
                                            </span>
                                        </div>
                                    )}
                                    {errors.file && (
                                        <p className="text-sm text-destructive">
                                            {errors.file}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="revision_date">
                                        {__('Revision Date')}
                                    </Label>
                                    <Input
                                        id="revision_date"
                                        type="date"
                                        value={data.revision_date}
                                        onChange={(e) =>
                                            setData(
                                                'revision_date',
                                                e.target.value,
                                            )
                                        }
                                        required={!!data.file}
                                    />
                                    {errors.revision_date && (
                                        <p className="text-sm text-destructive">
                                            {errors.revision_date}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="doc_date">
                                            {__('Doc Day (1-31)')}
                                        </Label>
                                        <Input
                                            id="doc_date"
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={data.doc_date}
                                            onChange={(e) =>
                                                setData(
                                                    'doc_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.doc_date && (
                                            <p className="text-sm text-destructive">
                                                {errors.doc_date}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="doc_month">
                                            {__('Doc Month (1-12)')}
                                        </Label>
                                        <Input
                                            id="doc_month"
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={data.doc_month}
                                            onChange={(e) =>
                                                setData(
                                                    'doc_month',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.doc_month && (
                                            <p className="text-sm text-destructive">
                                                {errors.doc_month}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="doc_year">
                                            {__('Doc Year')}
                                        </Label>
                                        <Input
                                            id="doc_year"
                                            type="number"
                                            min="1900"
                                            max="2100"
                                            value={data.doc_year}
                                            onChange={(e) =>
                                                setData(
                                                    'doc_year',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.doc_year && (
                                            <p className="text-sm text-destructive">
                                                {errors.doc_year}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href={documentsIndex()}>
                                    {__('Cancel')}
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 size-4" />{' '}
                                {__('Save Document')}
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
        { title: __('Documents'), href: documentsIndex() },
        { title: __('Add'), href: '#' },
    ],
};
