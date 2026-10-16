import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, FileUp, Download } from 'lucide-react';
import type { FormEvent } from 'react';
import CertificationController from '@/actions/App/Http/Controllers/CertificationController';
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
import { index as certificationsIndex } from '@/routes/certifications';

type Employee = { id: string; name: string };
type EmployeeCertification = {
    id: string;
    employee_id: string;
    name: string;
    institution: string;
    certification_number: string | null;
    issue_date: string;
    expiry_date: string | null;
    certificate_file: string | null;
};

type PageProps = {
    certification: EmployeeCertification;
    employees: Employee[];
};

export default function CertificationEdit({
    certification,
    employees = [],
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        employee_id: string;
        name: string;
        institution: string;
        certification_number: string;
        issue_date: string;
        expiry_date: string;
        certificate_file: File | null;
    }>({
        _method: 'put',
        employee_id: certification.employee_id,
        name: certification.name,
        institution: certification.institution,
        certification_number: certification.certification_number || '',
        issue_date: certification.issue_date.split('T')[0],
        expiry_date: certification.expiry_date
            ? certification.expiry_date.split('T')[0]
            : '',
        certificate_file: null,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(CertificationController.update.url(certification.id), {
            forceFormData: true,
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Edit Certification: :name', {
                    name: certification.name,
                })}
            />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
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
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Edit Certification')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__('Edit certification: :name', {
                            name: certification.name,
                        })}
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="mx-auto w-full max-w-2xl">
                <Card className="border shadow-sm dark:border-zinc-800">
                    <CardContent className="grid gap-6 pt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="employee_id">
                                {__('Employee')}
                            </Label>
                            <Select
                                value={data.employee_id}
                                onValueChange={(value) =>
                                    setData('employee_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="employee_id"
                                    className="w-full"
                                >
                                    <SelectValue
                                        placeholder={__('Select employee')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.employee_id && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.employee_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                {__('Certification Name')}
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full"
                            />
                            {errors.name && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="institution">
                                {__('Issuing Institution')}
                            </Label>
                            <Input
                                id="institution"
                                value={data.institution}
                                onChange={(e) =>
                                    setData('institution', e.target.value)
                                }
                                className="w-full"
                            />
                            {errors.institution && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.institution}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="certification_number">
                                {__('Credential Number / ID')}
                            </Label>
                            <Input
                                id="certification_number"
                                value={data.certification_number}
                                onChange={(e) =>
                                    setData(
                                        'certification_number',
                                        e.target.value,
                                    )
                                }
                                className="w-full"
                            />
                            {errors.certification_number && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.certification_number}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="issue_date">
                                    {__('Issue Date')}
                                </Label>
                                <Input
                                    id="issue_date"
                                    type="date"
                                    value={data.issue_date}
                                    onChange={(e) =>
                                        setData('issue_date', e.target.value)
                                    }
                                    className="w-full"
                                />
                                {errors.issue_date && (
                                    <p className="text-sm font-medium text-destructive">
                                        {errors.issue_date}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="expiry_date">
                                    {__('Expiry Date')}
                                </Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) =>
                                        setData('expiry_date', e.target.value)
                                    }
                                    className="w-full"
                                    placeholder={__('Leave blank for lifetime')}
                                />
                                {errors.expiry_date && (
                                    <p className="text-sm font-medium text-destructive">
                                        {errors.expiry_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="certificate_file">
                                {__('Certificate Document (PDF, PNG, JPG)')}
                            </Label>

                            {certification.certificate_file && (
                                <div className="mb-2 flex items-center justify-between rounded-lg border bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                                    <span className="text-muted-foreground">
                                        {__('Current File:')}
                                    </span>
                                    <a
                                        href={`/storage/${certification.certificate_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                                    >
                                        <Download className="h-3.5 w-3.5" />{' '}
                                        {__('View Current Certificate')}
                                    </a>
                                </div>
                            )}

                            <Input
                                id="certificate_file"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) =>
                                    setData(
                                        'certificate_file',
                                        e.target.files?.[0] || null,
                                    )
                                }
                                className="w-full cursor-pointer file:cursor-pointer"
                            />

                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <FileUp className="h-3.5 w-3.5 text-zinc-500" />{' '}
                                {__(
                                    'Upload a new file only if you wish to replace the current one. Max size: 2MB.',
                                )}
                            </p>
                            {errors.certificate_file && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.certificate_file}
                                </p>
                            )}
                        </div>

                        <div className="mt-2 flex justify-end gap-3 border-t pt-4">
                            <Link href={certificationsIndex()}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    {__('Cancel')}
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Save className="h-4 w-4" />{' '}
                                {processing
                                    ? __('Saving...')
                                    : __('Update Certification')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}

CertificationEdit.layout = {
    breadcrumbs: [
        { title: __('Trainings'), href: '#' },
        { title: __('Certifications'), href: certificationsIndex() },
        { title: __('Edit Certification'), href: '#' },
    ],
};
