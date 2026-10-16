import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
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
import {
    index as documentsIndex,
    show as documentShow,
} from '@/routes/documents';

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

export default function DocumentEdit({
    document,
    documentTypes,
    organizations,
}: PageProps) {
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
            <Head
                title={__('Edit Metadata - :title', { title: document.title })}
            />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={documentShow.url(document.id)}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title={__('Edit Document Metadata')}
                        description={__(
                            'Modify title, document number, type, organization, and status',
                        )}
                    />
                </div>

                <form
                    onSubmit={submit}
                    className="mx-auto grid w-full max-w-2xl gap-6"
                >
                    <Card>
                        <CardContent className="grid gap-6 pt-6">
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

                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={documentShow.url(document.id)}>
                                {__('Cancel')}
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" />{' '}
                            {__('Save changes')}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentEdit.layout = {
    breadcrumbs: [
        { title: __('Documents'), href: documentsIndex() },
        { title: __('Edit Metadata'), href: '#' },
    ],
};
