import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
    Download,
    ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';
import CertificationController from '@/actions/App/Http/Controllers/CertificationController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import {
    index as certificationsIndex,
    create as certificationCreate,
    edit as certificationEdit,
    show as certificationShow,
} from '@/routes/certifications';
import type { Auth } from '@/types';

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
    auth: Auth;
    certifications: EmployeeCertification[];
    filters: {
        search?: string;
    };
    [key: string]: any;
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(intlLocale(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default function CertificationsIndex({
    certifications = [],
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingCertification, setDeletingCertification] =
        useState<EmployeeCertification | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredCertifications = certifications.filter((cert) => {
        const matchesSearch =
            cert.name.toLowerCase().includes(search.toLowerCase()) ||
            cert.institution.toLowerCase().includes(search.toLowerCase()) ||
            (cert.certification_number &&
                cert.certification_number
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
            (cert.employee?.name &&
                cert.employee.name
                    .toLowerCase()
                    .includes(search.toLowerCase()));

        // Check if certification is expired or active
        const isExpired = cert.expiry_date
            ? new Date(cert.expiry_date) < new Date()
            : false;
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && !isExpired) ||
            (statusFilter === 'expired' && isExpired);

        return matchesSearch && matchesStatus;
    });

    const mayManage = can(auth, 'certification.manage');

    function destroyCertification(): void {
        if (!deletingCertification) {
            return;
        }

        router.delete(
            CertificationController.destroy.url(deletingCertification.id),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingCertification(null),
            },
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Employee Certifications')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        <Award className="h-8 w-8 text-primary" />{' '}
                        {__('Employee Certifications')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage professional credentials, licenses, and certifications held by employees.',
                        )}
                    </p>
                </div>
                {mayManage && (
                    <Link href={certificationCreate()}>
                        <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                            <Plus className="h-4 w-4" />{' '}
                            {__('Add Certification')}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search certifications...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Statuses')}</option>
                        <option value="active">{__('Active')}</option>
                        <option value="expired">{__('Expired')}</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Employee')}</th>
                                <th className="px-6 py-4">
                                    {__('Certification Name')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Institution')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Credential Number')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Validity Date')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('File')}
                                </th>
                                <th className="w-[150px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {filteredCertifications.length > 0 ? (
                                filteredCertifications.map((cert) => {
                                    const isExpired = cert.expiry_date
                                        ? new Date(cert.expiry_date) <
                                          new Date()
                                        : false;

                                    return (
                                        <tr
                                            key={cert.id}
                                            className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                                {cert.employee?.name ||
                                                    __('Unknown Employee')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-zinc-800 dark:text-zinc-200">
                                                {cert.name}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {cert.institution}
                                            </td>
                                            <td className="px-6 py-4">
                                                {cert.certification_number ? (
                                                    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                        {
                                                            cert.certification_number
                                                        }
                                                    </code>
                                                ) : (
                                                    <span className="text-zinc-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs text-muted-foreground">
                                                        {__('Issued: :date', {
                                                            date: formatDate(
                                                                cert.issue_date,
                                                            ),
                                                        })}
                                                    </span>
                                                    {cert.expiry_date ? (
                                                        <span className="text-xs text-muted-foreground">
                                                            {__(
                                                                'Expires: :date',
                                                                {
                                                                    date: formatDate(
                                                                        cert.expiry_date,
                                                                    ),
                                                                },
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-emerald-600">
                                                            {__(
                                                                'Lifetime / No Expiry',
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isExpired ? (
                                                    <Badge
                                                        variant="destructive"
                                                        className="gap-1"
                                                    >
                                                        <ShieldAlert className="h-3 w-3" />{' '}
                                                        {__('Expired')}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="default"
                                                        className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-400"
                                                    >
                                                        {__('Active')}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {cert.certificate_file ? (
                                                    <a
                                                        href={`/storage/${cert.certificate_file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                                    >
                                                        <Download className="h-4.5 w-4.5" />{' '}
                                                        {__('Certificate')}
                                                    </a>
                                                ) : (
                                                    <span className="text-zinc-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={certificationShow.url(
                                                            cert.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={__(
                                                                'View Detail',
                                                            )}
                                                            className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayManage && (
                                                        <>
                                                            <Link
                                                                href={certificationEdit.url(
                                                                    cert.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title={__(
                                                                        'Edit',
                                                                    )}
                                                                    className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                title={__(
                                                                    'Delete',
                                                                )}
                                                                onClick={() =>
                                                                    setDeletingCertification(
                                                                        cert,
                                                                    )
                                                                }
                                                                className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No certifications found matching the filters.',
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={deletingCertification !== null}
                onOpenChange={(open) => !open && setDeletingCertification(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Certification')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        {__(
                            'Are you sure you want to delete the certification :name for :employee? This action cannot be undone.',
                            {
                                name: deletingCertification?.name,
                                employee: deletingCertification?.employee?.name,
                            },
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingCertification(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyCertification}
                            className="cursor-pointer"
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CertificationsIndex.layout = {
    breadcrumbs: [
        { title: __('Trainings'), href: '#' },
        { title: __('Certifications'), href: certificationsIndex() },
    ],
};
