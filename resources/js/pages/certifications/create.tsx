import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, FileUp } from 'lucide-react';
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

type PageProps = {
    employees: Employee[];
};

export default function CertificationCreate({ employees = [] }: PageProps) {
    const { data, setData, post, processing, errors } = useForm<{
        employee_id: string;
        name: string;
        institution: string;
        certification_number: string;
        issue_date: string;
        expiry_date: string;
        certificate_file: File | null;
    }>({
        employee_id: '',
        name: '',
        institution: '',
        certification_number: '',
        issue_date: '',
        expiry_date: '',
        certificate_file: null,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(CertificationController.store.url());
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Add Certification')} />
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
                        {__('Add Certification')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Register a new professional certification or credential for an employee.',
                        )}
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
                                placeholder={__(
                                    'e.g. AWS Certified Solutions Architect',
                                )}
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
                                placeholder={__(
                                    'e.g. Amazon Web Services (AWS)',
                                )}
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
                                placeholder={__('e.g. AWS-12345678')}
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
                            <div className="flex items-center gap-3">
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
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <FileUp className="h-3.5 w-3.5 text-zinc-500" />{' '}
                                {__(
                                    'Max file size: 2MB. Accepted formats: PDF, Image files.',
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
                                    : __('Save Certification')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}

CertificationCreate.layout = {
    breadcrumbs: [
        { title: __('Trainings'), href: '#' },
        { title: __('Certifications'), href: certificationsIndex() },
        { title: __('Add Certification'), href: '#' },
    ],
};
