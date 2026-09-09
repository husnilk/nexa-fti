import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Award, Building2, Calendar, ClipboardCheck, Download, Pencil, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { index as certificationsIndex, edit as certificationEdit } from '@/routes/certifications';

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
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function CertificationShow({ certification }: PageProps) {
    const isExpired = certification.expiry_date ? new Date(certification.expiry_date) < new Date() : false;

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Certification: ${certification.name}`} />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={certificationsIndex()}>
                        <Button variant="outline" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                            {certification.name}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Issued by: {certification.institution}
                        </p>
                    </div>
                </div>
                <Link href={certificationEdit.url(certification.id)}>
                    <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                        <Pencil className="h-4 w-4" /> Edit Certification
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Certification Information */}
                <Card className="border dark:border-zinc-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <Award className="size-5 text-primary" />
                            Certification Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Certification Name</span>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{certification.name}</span>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Issuing Institution</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{certification.institution}</span>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Credential Number / ID</span>
                            {certification.certification_number ? (
                                <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                    {certification.certification_number}
                                </code>
                            ) : (
                                <span className="text-zinc-400 font-medium">—</span>
                            )}
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                            {isExpired ? (
                                <Badge variant="destructive" className="gap-1.5 py-0.5 px-2.5">
                                    <ShieldAlert className="h-3.5 w-3.5" /> Expired
                                </Badge>
                            ) : (
                                <Badge variant="default" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/35 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 py-0.5 px-2.5">
                                    <ShieldCheck className="h-3.5 w-3.5 mr-1 inline" /> Active
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Validity and Document Information */}
                <Card className="border dark:border-zinc-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <ClipboardCheck className="size-5 text-primary" />
                            Validity & Document
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Employee Name</span>
                            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                                <User className="size-4 text-zinc-500" />
                                {certification.employee?.name || 'Unknown Employee'}
                            </div>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Issue Date</span>
                            <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                                <Calendar className="size-4 text-zinc-500" />
                                {formatDate(certification.issue_date)}
                            </div>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Expiry Date</span>
                            <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                                <Calendar className="size-4 text-zinc-500" />
                                {certification.expiry_date ? (
                                    formatDate(certification.expiry_date)
                                ) : (
                                    <span className="text-emerald-600 font-semibold">Lifetime / No Expiry</span>
                                )}
                            </div>
                        </div>
                        <Separator className="dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Certificate Document</span>
                            {certification.certificate_file ? (
                                <a
                                    href={`/storage/${certification.certificate_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                                >
                                    <Download className="h-4.5 w-4.5" /> View / Download Document
                                </a>
                            ) : (
                                <span className="text-zinc-400 font-medium">— No Document Uploaded</span>
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
        { title: 'Trainings', href: '#' },
        { title: 'Certifications', href: certificationsIndex() },
        { title: 'Certification Detail', href: '#' },
    ],
};
