import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import DocumentTypeController from '@/actions/App/Http/Controllers/DocumentTypeController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index as documentTypesIndex } from '@/routes/document-types';

export default function DocumentTypeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(DocumentTypeController.store.url());
    }

    return (
        <>
            <Head title="Add Document Type" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={documentTypesIndex()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="Add Document Type"
                        description="Create a new category for documents"
                    />
                </div>

                <form onSubmit={submit} className="mx-auto w-full max-w-2xl grid gap-6">
                    <Card>
                        <CardContent className="pt-6 grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Standard Operating Procedure"
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of the document type..."
                                    rows={4}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={documentTypesIndex()}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" /> Save
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentTypeCreate.layout = {
    breadcrumbs: [
        { title: 'Documents', href: '#' },
        { title: 'Document Types', href: documentTypesIndex() },
        { title: 'Add', href: '#' },
    ],
};
