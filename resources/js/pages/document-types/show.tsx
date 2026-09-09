import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit3 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { index as documentTypesIndex, edit as documentTypeEdit } from '@/routes/document-types';

type DocumentType = {
    id: number;
    name: string;
    description?: string;
};

type PageProps = {
    documentType: DocumentType;
};

export default function DocumentTypeShow({ documentType }: PageProps) {
    return (
        <>
            <Head title={`Details - ${documentType.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={documentTypesIndex()}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={documentType.name}
                            description="Document Type Details"
                        />
                    </div>
                    
                    <Button asChild>
                        <Link href={documentTypeEdit.url(documentType.id)}>
                            <Edit3 className="mr-2 size-4" /> Edit
                        </Link>
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardContent className="pt-6 grid gap-4 text-sm">
                        <div className="grid gap-1">
                            <span className="text-muted-foreground text-xs">ID</span>
                            <span className="font-mono text-xs">{documentType.id}</span>
                        </div>

                        <div className="grid gap-1">
                            <span className="text-muted-foreground text-xs">Name</span>
                            <span className="font-semibold text-base">{documentType.name}</span>
                        </div>

                        <div className="grid gap-1">
                            <span className="text-muted-foreground text-xs">Description</span>
                            <span className="text-muted-foreground">{documentType.description || 'No description provided.'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DocumentTypeShow.layout = {
    breadcrumbs: [
        { title: 'Documents', href: '#' },
        { title: 'Document Types', href: documentTypesIndex() },
        { title: 'Details', href: '#' },
    ],
};
