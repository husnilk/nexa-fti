import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Calendar,
    ClipboardCheck,
    Download,
    Pencil,
    ShieldAlert,
    ShieldCheck,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { __, intlLocale } from '@/lib/i18n';
import {
    index as certificationsIndex,
    edit as certificationEdit,
} from '@/routes/certifications';

type EmployeeCertification = {
    id: string;
    employee_id: string;
    name: string;
    institution: string;
    certification_number: string | null;
    issue_date: string;
    expiry_date: string | null;
    certificate_file: string | null;
    employee?: {
        id: string;
        name: string;
    };
};

type PageProps = {
    certification: EmployeeCertification;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(intlLocale(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function CertificationShow({ certification }: PageProps) {
    const isExpired = certification.expiry_date
        ? new Date(certification.expiry_date) < new Date()
        : false;

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Certification: :name', { name: certification.name })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href={certificationsIndex()}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {certification.name}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Issued by: :institution', {
                                institution: certification.institution,
                            })}
                        </p>
                    </div>
                </div>
                <Link href={certificationEdit.url(certification.id)}>
                    <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                        <Pencil className="h-4 w-4" />{' '}
                        {__('Edit Certification')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Certification Information */}
                <Card className="border shadow-sm dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <Award className="size-5 text-primary" />
                            {__('Certification Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Certification Name')}
                            </span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {certification.name}
                            </span>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Issuing Institution')}
                            </span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                {certification.institution}
                            </span>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Credential Number / ID')}
                            </span>
                            {certification.certification_number ? (
                                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                    {certification.certification_number}
                                </code>
                            ) : (
                                <span className="font-medium text-zinc-400">
                                    —
                                </span>
                            )}
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Status')}
                            </span>
                            {isExpired ? (
                                <Badge
                                    variant="destructive"
                                    className="gap-1.5 px-2.5 py-0.5"
                                >
                                    <ShieldAlert className="h-3.5 w-3.5" />{' '}
                                    {__('Expired')}
                                </Badge>
                            ) : (
                                <Badge
                                    variant="default"
                                    className="border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-400"
                                >
                                    <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />{' '}
                                    {__('Active')}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Validity and Document Information */}
                <Card className="border shadow-sm dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <ClipboardCheck className="size-5 text-primary" />
                            {__('Validity & Document')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Employee Name')}
                            </span>
                            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                                <User className="size-4 text-zinc-500" />
                                {certification.employee?.name ||
                                    __('Unknown Employee')}
                            </div>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Issue Date')}
                            </span>
                            <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                                <Calendar className="size-4 text-zinc-500" />
                                {formatDate(certification.issue_date)}
                            </div>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Expiry Date')}
                            </span>
                            <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                                <Calendar className="size-4 text-zinc-500" />
                                {certification.expiry_date ? (
                                    formatDate(certification.expiry_date)
                                ) : (
                                    <span className="font-semibold text-emerald-600">
                                        {__('Lifetime / No Expiry')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Certificate Document')}
                            </span>
                            {certification.certificate_file ? (
                                <a
                                    href={`/storage/${certification.certificate_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
                                >
                                    <Download className="h-4.5 w-4.5" />{' '}
                                    {__('View / Download Document')}
                                </a>
                            ) : (
                                <span className="font-medium text-zinc-400">
                                    — {__('No Document Uploaded')}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

CertificationShow.layout = {
    breadcrumbs: [
        { title: __('Trainings'), href: '#' },
        { title: __('Certifications'), href: certificationsIndex() },
        { title: __('Certification Detail'), href: '#' },
    ],
};
