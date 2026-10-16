import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import EmployeeController from '@/actions/App/Http/Controllers/Hr/EmployeeController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types/hr';

export type EmployeeFormData = {
    name: string;
    email: string;
    emp_number: string;
    id_card_number: string;
    tax_id_number: string;
    birth_place: string;
    birth_date: string;
    gender: 'male' | 'female';
    religion: string;
    marital_status: string;
    address: string;
    phone: string;
    join_date: string;
    employment_type_id: string;
    supervisor_id: string | null;
    status: number;
    specialization: 'lecturer' | 'staff';
    academic_rank: string;
    functional_position_id: string;
    nuptk: string;
    expertise: string;
    position_id: string;
    skills: string;
};

export function toEmployeeFormData(
    employee?: Employee | any | null,
): EmployeeFormData {
    const isStaff = !!employee?.staff;
    const isLecturer = !!employee?.lecturer;
    const specialization = isStaff && !isLecturer ? 'staff' : 'lecturer';

    return {
        name: employee?.name || '',
        email: employee?.email || '',
        emp_number: employee?.emp_number || '',
        id_card_number: employee?.id_card_number || '',
        tax_id_number: employee?.tax_id_number || '',
        birth_place: employee?.birth_place || '',
        birth_date: employee?.birth_date
            ? employee.birth_date.split('T')[0]
            : '',
        gender: (employee?.gender as 'male' | 'female') || 'male',
        religion: employee?.religion || 'Islam',
        marital_status: employee?.marital_status || 'Single',
        address: employee?.address || '',
        phone: employee?.phone || '',
        join_date: employee?.join_date ? employee.join_date.split('T')[0] : '',
        employment_type_id: employee?.employment_type_id || '',
        supervisor_id: employee?.supervisor_id || null,
        status: employee?.status !== undefined ? Number(employee.status) : 1,
        specialization,
        academic_rank: employee?.lecturer?.academic_rank || '',
        functional_position_id:
            employee?.lecturer?.functional_position_id || '',
        nuptk: employee?.lecturer?.nuptk || '',
        expertise: employee?.lecturer?.expertise || '',
        position_id: employee?.staff?.position_id || '',
        skills: employee?.staff?.skills || '',
    };
}

export const RELIGION_LABELS: Record<string, string> = {
    Islam: __('Islam'),
    Kristen: __('Christian'),
    Katolik: __('Catholic'),
    Hindu: __('Hindu'),
    Budha: __('Buddhist'),
    Konghucu: __('Confucian'),
    Lainnya: __('Other'),
};

interface EmployeeFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | any | null;
    employmentTypes: any[];
    functionalPositions: any[];
    positions: any[];
    supervisors: any[];
    onSuccess?: () => void;
}

export function EmployeeFormModal({
    open,
    onOpenChange,
    employee,
    employmentTypes,
    functionalPositions,
    positions,
    supervisors,
    onSuccess,
}: EmployeeFormModalProps) {
    const isEdit = !!employee?.id;

    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<EmployeeFormData>(toEmployeeFormData(employee));

    useEffect(() => {
        if (open) {
            setData(toEmployeeFormData(employee));
            clearErrors();
        }
    }, [open, employee]);

    const availableSupervisors = useMemo(() => {
        if (!isEdit || !employee?.id) {
            return supervisors;
        }

        return supervisors.filter((s) => s.id !== employee.id);
    }, [supervisors, isEdit, employee?.id]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (isEdit) {
            patch(EmployeeController.update.url(employee.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success(__('Employee updated successfully'));
                    onSuccess?.();
                },
            });
        } else {
            post(EmployeeController.store.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success(__('Employee created successfully'));
                    onSuccess?.();
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b p-6 pb-4">
                        <DialogTitle className="text-xl font-bold">
                            {isEdit
                                ? __('Edit Employee: :name', {
                                      name: employee?.name,
                                  })
                                : __('Add Employee')}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? __(
                                      'Update employee profile details, employment settings, and professional specification.',
                                  )
                                : __(
                                      'Onboard a new lecturer or staff member to the institution.',
                                  )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 p-6">
                        {/* 1. Personal Information */}
                        <div className="space-y-4 rounded-lg border bg-card/50 p-5 shadow-xs">
                            <h3 className="border-b pb-2 text-base font-semibold text-foreground">
                                {__('Personal Information')}
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-name">
                                        {__('Full Name')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-name"
                                        placeholder={__('e.g. Dr. Jane Doe')}
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-email">
                                        {__('Work Email')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-email"
                                        type="email"
                                        placeholder="jane.doe@university.ac.id"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-emp_number">
                                        {__('Employee Number (NIP/NIDN)')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-emp_number"
                                        placeholder={__(
                                            'e.g. 198501012010121001',
                                        )}
                                        value={data.emp_number}
                                        onChange={(e) =>
                                            setData(
                                                'emp_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={errors.emp_number} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-id_card_number">
                                        {__('ID Card (KTP)')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-id_card_number"
                                        placeholder={__('16-digit National ID')}
                                        value={data.id_card_number}
                                        onChange={(e) =>
                                            setData(
                                                'id_card_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.id_card_number}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-tax_id">
                                        {__('Tax ID (NPWP)')}
                                    </Label>
                                    <Input
                                        id="employee-tax_id"
                                        placeholder={__(
                                            'Tax Identification Number',
                                        )}
                                        value={data.tax_id_number}
                                        onChange={(e) =>
                                            setData(
                                                'tax_id_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.tax_id_number}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-phone">
                                        {__('Phone Number')}
                                    </Label>
                                    <Input
                                        id="employee-phone"
                                        placeholder="+62 812 3456 7890"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-birth_place">
                                        {__('Birth Place')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-birth_place"
                                        placeholder={__('City of birth')}
                                        value={data.birth_place}
                                        onChange={(e) =>
                                            setData(
                                                'birth_place',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={errors.birth_place} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-birth_date">
                                        {__('Birth Date')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) =>
                                            setData(
                                                'birth_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={errors.birth_date} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-gender">
                                        {__('Gender')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.gender}
                                        onValueChange={(v: 'male' | 'female') =>
                                            setData('gender', v)
                                        }
                                    >
                                        <SelectTrigger id="employee-gender">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">
                                                {__('Male')}
                                            </SelectItem>
                                            <SelectItem value="female">
                                                {__('Female')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gender} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-religion">
                                        {__('Religion')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.religion}
                                        onValueChange={(v) =>
                                            setData('religion', v)
                                        }
                                    >
                                        <SelectTrigger id="employee-religion">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(
                                                RELIGION_LABELS,
                                            ).map(([r, label]) => (
                                                <SelectItem key={r} value={r}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.religion} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-marital">
                                        {__('Marital Status')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-marital"
                                        placeholder={__('e.g. Single, Married')}
                                        value={data.marital_status}
                                        onChange={(e) =>
                                            setData(
                                                'marital_status',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.marital_status}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="employee-address">
                                    {__('Address')}
                                </Label>
                                <Textarea
                                    id="employee-address"
                                    placeholder={__(
                                        'Residential street address',
                                    )}
                                    rows={2}
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                                <InputError message={errors.address} />
                            </div>
                        </div>

                        {/* 2. Employment Information */}
                        <div className="space-y-4 rounded-lg border bg-card/50 p-5 shadow-xs">
                            <h3 className="border-b pb-2 text-base font-semibold text-foreground">
                                {__('Employment Information')}
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-join_date">
                                        {__('Join Date')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="employee-join_date"
                                        type="date"
                                        value={data.join_date}
                                        onChange={(e) =>
                                            setData('join_date', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.join_date} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-emp_type">
                                        {__('Employment Type')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.employment_type_id}
                                        onValueChange={(v) =>
                                            setData('employment_type_id', v)
                                        }
                                    >
                                        <SelectTrigger id="employee-emp_type">
                                            <SelectValue
                                                placeholder={__('Select type')}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employmentTypes.map((t) => (
                                                <SelectItem
                                                    key={t.id}
                                                    value={t.id}
                                                >
                                                    {t.employee_type?.name} /{' '}
                                                    {
                                                        t.employment_contract
                                                            ?.name
                                                    }
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.employment_type_id}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-supervisor">
                                        {__('Direct Supervisor')}
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
                                        <SelectTrigger id="employee-supervisor">
                                            <SelectValue
                                                placeholder={__(
                                                    'Select supervisor',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                {__('None')}
                                            </SelectItem>
                                            {availableSupervisors.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={s.id}
                                                >
                                                    {s.name} ({s.emp_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.supervisor_id}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="employee-status">
                                        {__('Status')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.status.toString()}
                                        onValueChange={(v) =>
                                            setData('status', parseInt(v))
                                        }
                                    >
                                        <SelectTrigger id="employee-status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                {__('Active')}
                                            </SelectItem>
                                            <SelectItem value="0">
                                                {__('Inactive')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>
                        </div>

                        {/* 3. Professional Specification */}
                        <div className="space-y-4 rounded-lg border bg-card/50 p-5 shadow-xs">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-base font-semibold text-foreground">
                                    {__('Professional Specification')}
                                </h3>
                                <div className="flex rounded-md bg-muted p-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                'specialization',
                                                'lecturer',
                                            )
                                        }
                                        className={cn(
                                            'cursor-pointer rounded-sm px-4 py-1.5 text-xs font-medium transition-all',
                                            data.specialization === 'lecturer'
                                                ? 'bg-background font-semibold text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {__('Lecturer')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData('specialization', 'staff')
                                        }
                                        className={cn(
                                            'cursor-pointer rounded-sm px-4 py-1.5 text-xs font-medium transition-all',
                                            data.specialization === 'staff'
                                                ? 'bg-background font-semibold text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {__('Staff')}
                                    </button>
                                </div>
                            </div>

                            {data.specialization === 'lecturer' ? (
                                <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="employee-rank">
                                                {__('Academic Rank')}
                                            </Label>
                                            <Input
                                                id="employee-rank"
                                                placeholder={__(
                                                    'e.g. Asisten Ahli, Lektor',
                                                )}
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
                                        <div className="space-y-1.5">
                                            <Label htmlFor="employee-func">
                                                {__('Functional Position')}
                                            </Label>
                                            <Select
                                                value={
                                                    data.functional_position_id ||
                                                    'none'
                                                }
                                                onValueChange={(v) =>
                                                    setData(
                                                        'functional_position_id',
                                                        v === 'none' ? '' : v,
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="employee-func">
                                                    <SelectValue
                                                        placeholder={__(
                                                            'Select level',
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        {__('None')}
                                                    </SelectItem>
                                                    {functionalPositions.map(
                                                        (f) => (
                                                            <SelectItem
                                                                key={f.id}
                                                                value={f.id}
                                                            >
                                                                {__(
                                                                    ':name (Lvl :level)',
                                                                    {
                                                                        name: f.name,
                                                                        level: f.level,
                                                                    },
                                                                )}
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
                                        <div className="space-y-1.5 md:col-span-2">
                                            <Label htmlFor="employee-nuptk">
                                                NUPTK
                                            </Label>
                                            <Input
                                                id="employee-nuptk"
                                                placeholder="Nomor Unik Pendidik dan Tenaga Kependidikan"
                                                value={data.nuptk}
                                                onChange={(e) =>
                                                    setData(
                                                        'nuptk',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.nuptk}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="employee-expertise">
                                            {__('Area of Expertise')}
                                        </Label>
                                        <Textarea
                                            id="employee-expertise"
                                            placeholder={__(
                                                'Specializations, research interests, and domain expertise',
                                            )}
                                            rows={2}
                                            value={data.expertise}
                                            onChange={(e) =>
                                                setData(
                                                    'expertise',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.expertise}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="employee-pos">
                                            {__('Structural Position')}
                                        </Label>
                                        <Select
                                            value={data.position_id || 'none'}
                                            onValueChange={(v) =>
                                                setData(
                                                    'position_id',
                                                    v === 'none' ? '' : v,
                                                )
                                            }
                                        >
                                            <SelectTrigger id="employee-pos">
                                                <SelectValue
                                                    placeholder={__(
                                                        'Select position',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    {__('None')}
                                                </SelectItem>
                                                {positions.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name}{' '}
                                                        {p.grade
                                                            ? __(
                                                                  '(Grade :grade)',
                                                                  {
                                                                      grade: p.grade,
                                                                  },
                                                              )
                                                            : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.position_id}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="employee-skills">
                                            {__('Key Skills')}
                                        </Label>
                                        <Textarea
                                            id="employee-skills"
                                            placeholder={__(
                                                'Relevant technical, organizational, and operational skills',
                                            )}
                                            rows={2}
                                            value={data.skills}
                                            onChange={(e) =>
                                                setData(
                                                    'skills',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.skills} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="border-t bg-muted/20 p-6 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-xs hover:from-violet-700 hover:to-indigo-700"
                        >
                            {processing
                                ? isEdit
                                    ? __('Saving Changes...')
                                    : __('Creating...')
                                : isEdit
                                  ? __('Save Changes')
                                  : __('Create Employee')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
