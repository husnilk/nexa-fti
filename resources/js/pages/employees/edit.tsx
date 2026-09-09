import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';
import EmployeeController from '@/actions/App/Http/Controllers/Hr/EmployeeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as employeesIndex } from '@/routes/employees';

type PageProps = {
    employee: any;
    employmentTypes: any[];
    functionalPositions: any[];
    positions: any[];
    supervisors: any[];
};

export default function EmployeeEdit({
    employee,
    employmentTypes,
    functionalPositions,
    positions,
    supervisors,
}: PageProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: employee.name,
        email: employee.email,
        emp_number: employee.emp_number,
        id_card_number: employee.id_card_number,
        tax_id_number: employee.tax_id_number || '',
        birth_place: employee.birth_place,
        birth_date: employee.birth_date,
        gender: employee.gender,
        religion: employee.religion,
        marital_status: employee.marital_status,
        address: employee.address || '',
        phone: employee.phone || '',
        join_date: employee.join_date,
        employment_type_id: employee.employment_type_id,
        supervisor_id: employee.supervisor_id as string | null,
        status: employee.status,

        // Specialization data (passed from controller load)
        academic_rank: employee.lecturer?.academic_rank || '',
        functional_position_id: employee.lecturer?.functional_position_id || '',
        nuptk: employee.lecturer?.nuptk || '',
        expertise: employee.lecturer?.expertise || '',

        position_id: employee.staff?.position_id || '',
        skills: employee.staff?.skills || '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        patch(EmployeeController.update.url(employee.id));
    }

    return (
        <>
            <Head title={`Edit Employee: ${employee.name}`} />
            <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Link
                        href={employeesIndex()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" /> Back to Employees
                    </Link>
                    <Heading
                        title={`Edit ${employee.name}`}
                        description="Update employee profile and specifications"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6 rounded-lg border bg-card p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emp_number">
                                    Employee Number
                                </Label>
                                <Input
                                    id="emp_number"
                                    value={data.emp_number}
                                    onChange={(e) =>
                                        setData('emp_number', e.target.value)
                                    }
                                />
                                <InputError message={errors.emp_number} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="id_card_number">
                                    ID Card (KTP)
                                </Label>
                                <Input
                                    id="id_card_number"
                                    value={data.id_card_number}
                                    onChange={(e) =>
                                        setData(
                                            'id_card_number',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.id_card_number} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(v) => setData('gender', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status.toString()}
                                    onValueChange={(v) =>
                                        setData('status', parseInt(v))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="0">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="emp_type">
                                    Employment Type
                                </Label>
                                <Select
                                    value={data.employment_type_id}
                                    onValueChange={(v) =>
                                        setData('employment_type_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employmentTypes.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.employee_type.name} /{' '}
                                                {t.employment_contract.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="supervisor">
                                Direct Supervisor
                            </Label>
                            <Select
                                value={data.supervisor_id || 'none'}
                                onValueChange={(v) =>
                                    setData(
                                        'supervisor_id',
                                        v === 'none' ? null : v,
                                    )
                                }
                            >
                                <SelectTrigger id="supervisor">
                                    <SelectValue placeholder="Select supervisor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {supervisors.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name} ({s.emp_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.supervisor_id} />
                        </div>
                    </div>

                    {employee.lecturer && (
                        <div className="space-y-6 rounded-lg border bg-card p-6">
                            <h3 className="border-b pb-2 text-lg font-semibold text-primary">
                                Lecturer Specification
                            </h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="rank">Academic Rank</Label>
                                    <Input
                                        id="rank"
                                        value={data.academic_rank}
                                        onChange={(e) =>
                                            setData(
                                                'academic_rank',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.academic_rank}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="func">
                                        Functional Position
                                    </Label>
                                    <Select
                                        value={data.functional_position_id}
                                        onValueChange={(v) =>
                                            setData('functional_position_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {functionalPositions.map((f) => (
                                                <SelectItem
                                                    key={f.id}
                                                    value={f.id}
                                                >
                                                    {f.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expertise">Expertise</Label>
                                <textarea
                                    id="expertise"
                                    className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                    value={data.expertise}
                                    onChange={(e) =>
                                        setData('expertise', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {employee.staff && (
                        <div className="space-y-6 rounded-lg border bg-card p-6">
                            <h3 className="border-b pb-2 text-lg font-semibold text-primary">
                                Staff Specification
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="pos">Structural Position</Label>
                                <Select
                                    value={data.position_id}
                                    onValueChange={(v) =>
                                        setData('position_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {positions.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills</Label>
                                <textarea
                                    id="skills"
                                    className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                    value={data.skills}
                                    onChange={(e) =>
                                        setData('skills', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={employeesIndex()}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Update Employee
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
