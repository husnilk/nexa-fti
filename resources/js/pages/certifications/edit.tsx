import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, FileUp, Download } from 'lucide-react';
import type { FormEvent } from 'react';
import CertificationController from '@/actions/App/Http/Controllers/CertificationController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function CertificationEdit({ certification, employees = [] }: PageProps) {
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
        expiry_date: certification.expiry_date ? certification.expiry_date.split('T')[0] : '',
        certificate_file: null,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(CertificationController.update.url(certification.id), {
            forceFormData: true,
        });
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Edit Certification: ${certification.name}`} />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={certificationsIndex()}>
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Edit Certification
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Edit certification: {certification.name}
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="mx-auto w-full max-w-2xl">
                <Card className="border dark:border-zinc-800 shadow-sm">
                    <CardContent className="pt-6 grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="employee_id">Employee</Label>
                            <Select value={data.employee_id} onValueChange={(value) => setData('employee_id', value)}>
                                <SelectTrigger id="employee_id" className="w-full">
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.employee_id && <p className="text-sm text-destructive font-medium">{errors.employee_id}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Certification Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full"
                            />
                            {errors.name && <p className="text-sm text-destructive font-medium">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="institution">Issuing Institution</Label>
                            <Input
                                id="institution"
                                value={data.institution}
                                onChange={(e) => setData('institution', e.target.value)}
                                className="w-full"
                            />
                            {errors.institution && <p className="text-sm text-destructive font-medium">{errors.institution}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="certification_number">Credential Number / ID</Label>
                            <Input
                                id="certification_number"
                                value={data.certification_number}
                                onChange={(e) => setData('certification_number', e.target.value)}
                                className="w-full"
                            />
                            {errors.certification_number && <p className="text-sm text-destructive font-medium">{errors.certification_number}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="issue_date">Issue Date</Label>
                                <Input
                                    id="issue_date"
                                    type="date"
                                    value={data.issue_date}
                                    onChange={(e) => setData('issue_date', e.target.value)}
                                    className="w-full"
                                />
                                {errors.issue_date && <p className="text-sm text-destructive font-medium">{errors.issue_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="expiry_date">Expiry Date</Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                    className="w-full"
                                    placeholder="Leave blank for lifetime"
                                />
                                {errors.expiry_date && <p className="text-sm text-destructive font-medium">{errors.expiry_date}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="certificate_file">Certificate Document (PDF, PNG, JPG)</Label>
                            
                            {certification.certificate_file && (
                                <div className="mb-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Current File:</span>
                                    <a
                                        href={`/storage/${certification.certificate_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                                    >
                                        <Download className="h-3.5 w-3.5" /> View Current Certificate
                                    </a>
                                </div>
                            )}

                            <Input
                                id="certificate_file"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => setData('certificate_file', e.target.files?.[0] || null)}
                                className="w-full cursor-pointer file:cursor-pointer"
                            />
                            
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <FileUp className="h-3.5 w-3.5 text-zinc-500" /> Upload a new file only if you wish to replace the current one. Max size: 2MB.
                            </p>
                            {errors.certificate_file && <p className="text-sm text-destructive font-medium">{errors.certificate_file}</p>}
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4 mt-2">
                            <Link href={certificationsIndex()}>
                                <Button type="button" variant="outline" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Update Certification'}
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
        { title: 'Trainings', href: '#' },
        { title: 'Certifications', href: certificationsIndex() },
        { title: 'Edit Certification', href: '#' },
    ],
};
