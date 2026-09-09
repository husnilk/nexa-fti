import { Head, Link, router, usePage } from '@inertiajs/react';
import { Award, Eye, Pencil, Plus, Search, Trash2, X, Download, Calendar, ShieldAlert } from 'lucide-react';
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
import { index as certificationsIndex, create as certificationCreate, edit as certificationEdit, show as certificationShow } from '@/routes/certifications';
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
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default function CertificationsIndex({ certifications = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingCertification, setDeletingCertification] = useState<EmployeeCertification | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredCertifications = certifications.filter((cert) => {
        const matchesSearch =
            cert.name.toLowerCase().includes(search.toLowerCase()) ||
            cert.institution.toLowerCase().includes(search.toLowerCase()) ||
            (cert.certification_number && cert.certification_number.toLowerCase().includes(search.toLowerCase())) ||
            (cert.employee?.name && cert.employee.name.toLowerCase().includes(search.toLowerCase()));

        // Check if certification is expired or active
        const isExpired = cert.expiry_date ? new Date(cert.expiry_date) < new Date() : false;
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

        router.delete(CertificationController.destroy.url(deletingCertification.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingCertification(null),
        });
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Employee Certifications" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Award className="h-8 w-8 text-primary" /> Employee Certifications
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage professional credentials, licenses, and certifications held by employees.
                    </p>
                </div>
                {mayManage && (
                    <Link href={certificationCreate()}>
                        <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                            <Plus className="h-4 w-4" /> Add Certification
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search certifications..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Employee</th>
                                <th className="py-4 px-6">Certification Name</th>
                                <th className="py-4 px-6">Institution</th>
                                <th className="py-4 px-6">Credential Number</th>
                                <th className="py-4 px-6">Validity Date</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-center">File</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredCertifications.length > 0 ? (
                                filteredCertifications.map((cert) => {
                                    const isExpired = cert.expiry_date ? new Date(cert.expiry_date) < new Date() : false;

                                    return (
                                        <tr key={cert.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                                {cert.employee?.name || 'Unknown Employee'}
                                            </td>
                                            <td className="py-4 px-6 text-zinc-800 dark:text-zinc-200 font-medium">
                                                {cert.name}
                                            </td>
                                            <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                                {cert.institution}
                                            </td>
                                            <td className="py-4 px-6">
                                                {cert.certification_number ? (
                                                    <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                                        {cert.certification_number}
                                                    </code>
                                                ) : (
                                                    <span className="text-zinc-400">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs text-muted-foreground">Issued: {formatDate(cert.issue_date)}</span>
                                                    {cert.expiry_date ? (
                                                        <span className="text-xs text-muted-foreground">Expires: {formatDate(cert.expiry_date)}</span>
                                                    ) : (
                                                        <span className="text-xs text-emerald-600 font-medium">Lifetime / No Expiry</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {isExpired ? (
                                                    <Badge variant="destructive" className="gap-1">
                                                        <ShieldAlert className="h-3 w-3" /> Expired
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="default" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/35 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                                                        Active
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {cert.certificate_file ? (
                                                    <a
                                                        href={`/storage/${cert.certificate_file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                                    >
                                                        <Download className="h-4.5 w-4.5" /> Certificate
                                                    </a>
                                                ) : (
                                                    <span className="text-zinc-400">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={certificationShow.url(cert.id)}>
                                                        <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayManage && (
                                                        <>
                                                            <Link href={certificationEdit.url(cert.id)}>
                                                                <Button variant="ghost" size="icon" title="Edit" className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Delete"
                                                                onClick={() => setDeletingCertification(cert)}
                                                                className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
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
                                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                        No certifications found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={deletingCertification !== null} onOpenChange={(open) => !open && setDeletingCertification(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Certification</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to delete the certification <strong className="text-zinc-950 dark:text-zinc-50">{deletingCertification?.name}</strong> for <strong>{deletingCertification?.employee?.name}</strong>? This action cannot be undone.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setDeletingCertification(null)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroyCertification} className="cursor-pointer">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CertificationsIndex.layout = {
    breadcrumbs: [
        { title: 'Trainings', href: '#' },
        { title: 'Certifications', href: certificationsIndex() },
    ],
};
