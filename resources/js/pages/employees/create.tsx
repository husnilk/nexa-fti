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
import { cn } from '@/lib/utils';
import { index as employeesIndex } from '@/routes/employees';

type PageProps = {
    employmentTypes: any[];
    functionalPositions: any[];
    positions: any[];
    supervisors: any[];
};

export default function EmployeeCreate({
    employmentTypes,
    functionalPositions,
    positions,
    supervisors,
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        emp_number: '',
        id_card_number: '',
        tax_id_number: '',
        birth_place: '',
        birth_date: '',
        gender: 'male',
        religion: 'Islam',
        marital_status: 'Single',
        address: '',
        phone: '',
        join_date: '',
        employment_type_id: '',
        supervisor_id: null as string | null,
        status: 1,
        specialization: 'lecturer' as 'lecturer' | 'staff',
        academic_rank: '',
        functional_position_id: '',
        nuptk: '',
        expertise: '',
        position_id: '',
        skills: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(EmployeeController.store.url());
    }

    return (
        <>
            <Head title="Add Employee" />
            <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Link
                        href={employeesIndex()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" /> Back to Employees
                    </Link>
                    <Heading
                        title="Add Employee"
                        description="Onboard a new lecturer or staff member"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Personal Information
                        </h3>
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
                                    Employee Number (NIP/NIDN)
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
                            <div className="space-y-2">
                                <Label htmlFor="tax_id">Tax ID (NPWP)</Label>
                                <Input
                                    id="tax_id"
                                    value={data.tax_id_number || ''}
                                    onChange={(e) =>
                                        setData('tax_id_number', e.target.value)
                                    }
                                />
                                <InputError message={errors.tax_id_number} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={data.phone || ''}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="birth_place">Birth Place</Label>
                                <Input
                                    id="birth_place"
                                    value={data.birth_place}
                                    onChange={(e) =>
                                        setData('birth_place', e.target.value)
                                    }
                                />
                                <InputError message={errors.birth_place} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birth_date">Birth Date</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) =>
                                        setData('birth_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.birth_date} />
                            </div>
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
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="religion">Religion</Label>
                                <Select
                                    value={data.religion}
                                    onValueChange={(v) =>
                                        setData('religion', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            'Islam',
                                            'Kristen',
                                            'Katolik',
                                            'Hindu',
                                            'Budha',
                                            'Konghucu',
                                            'Lainnya',
                                        ].map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {r}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="marital">Marital Status</Label>
                                <Input
                                    id="marital"
                                    value={data.marital_status}
                                    onChange={(e) =>
                                        setData(
                                            'marital_status',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.marital_status} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <textarea
                                id="address"
                                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.address || ''}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>

                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Employment Information
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="join_date">Join Date</Label>
                                <Input
                                    id="join_date"
                                    type="date"
                                    value={data.join_date}
                                    onChange={(e) =>
                                        setData('join_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.join_date} />
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
                                    <SelectTrigger id="emp_type">
                                        <SelectValue placeholder="Select type" />
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
                                <InputError
                                    message={errors.employment_type_id}
                                />
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
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        {supervisors.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} ({s.emp_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.supervisor_id} />
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
                        </div>
                    </div>

                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-lg font-semibold">
                                Professional Specification
                            </h3>
                            <div className="flex rounded-md bg-muted p-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData('specialization', 'lecturer')
                                    }
                                    className={cn(
                                        'rounded-sm px-4 py-1.5 text-sm font-medium transition-all',
                                        data.specialization === 'lecturer'
                                            ? 'bg-background shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    Lecturer
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData('specialization', 'staff')
                                    }
                                    className={cn(
                                        'rounded-sm px-4 py-1.5 text-sm font-medium transition-all',
                                        data.specialization === 'staff'
                                            ? 'bg-background shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    Staff
                                </button>
                            </div>
                        </div>

                        {data.specialization === 'lecturer' ? (
                            <div className="space-y-6 pt-2">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="rank">
                                            Academic Rank
                                        </Label>
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
                                                setData(
                                                    'functional_position_id',
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {functionalPositions.map(
                                                    (f) => (
                                                        <SelectItem
                                                            key={f.id}
                                                            value={f.id}
                                                        >
                                                            {f.name} (Lvl{' '}
                                                            {f.level})
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={
                                                errors.functional_position_id
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nuptk">NUPTK</Label>
                                        <Input
                                            id="nuptk"
                                            value={data.nuptk || ''}
                                            onChange={(e) =>
                                                setData('nuptk', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.nuptk} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expertise">
                                        Area of Expertise
                                    </Label>
                                    <textarea
                                        id="expertise"
                                        className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                        value={data.expertise || ''}
                                        onChange={(e) =>
                                            setData('expertise', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.expertise} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="pos">
                                        Structural Position
                                    </Label>
                                    <Select
                                        value={data.position_id}
                                        onValueChange={(v) =>
                                            setData('position_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions.map((p) => (
                                                <SelectItem
                                                    key={p.id}
                                                    value={p.id}
                                                >
                                                    {p.name} (Grade {p.grade})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.position_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="skills">Key Skills</Label>
                                    <textarea
                                        id="skills"
                                        className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                        value={data.skills || ''}
                                        onChange={(e) =>
                                            setData('skills', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.skills} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href={employeesIndex()}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Employee Record
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
