import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';
import StudentController from '@/actions/App/Http/Controllers/Hr/StudentController';
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
import { __ } from '@/lib/i18n';
import { index as studentsIndex } from '@/routes/students';

type PageProps = {
    departments: any[];
    advisors: any[];
};

const statusLabels: Record<string, string> = {
    active: __('Active'),
    inactive: __('Inactive'),
    graduated: __('Graduated'),
    withdrawn: __('Withdrawn'),
    on_leave: __('On Leave'),
};

const religionOptions: { value: string; label: string }[] = [
    { value: 'Islam', label: __('Islam') },
    { value: 'Kristen', label: __('Protestant') },
    { value: 'Katolik', label: __('Catholic') },
    { value: 'Hindu', label: __('Hindu') },
    { value: 'Budha', label: __('Buddhist') },
    { value: 'Konghucu', label: __('Confucian') },
    { value: 'Lainnya', label: __('Other') },
];

export default function StudentCreate({ departments, advisors }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        reg_no: '',
        reg_date: '',
        birth_place: '',
        birth_date: '',
        gender: 'male',
        religion: 'Islam',
        phone_no: '',
        campus_email: '',
        home_address: '',
        home_town: '',
        home_province: '',
        home_postalcode: '',
        current_address: '',
        current_town: '',
        current_province: '',
        current_postalcode: '',
        department_id: '',
        year: new Date().getFullYear(),
        status: 'active',
        advisor_id: '',
        photo: null as File | null,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(StudentController.store.url());
    }

    return (
        <>
            <Head title={__('Add Student')} />
            <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Link
                        href={studentsIndex()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />{' '}
                        {__('Back to Students')}
                    </Link>
                    <Heading
                        title={__('Add Student')}
                        description={__(
                            'Onboard a new student and create academic profile',
                        )}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                    {/* Identification & Contact */}
                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            {__('Identification & Contact')}
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">{__('Full Name')}</Label>
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
                                <Label htmlFor="reg_no">
                                    {__('Registration Number (NIM)')}
                                </Label>
                                <Input
                                    id="reg_no"
                                    value={data.reg_no}
                                    onChange={(e) =>
                                        setData('reg_no', e.target.value)
                                    }
                                />
                                <InputError message={errors.reg_no} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    {__('Personal Email')}
                                </Label>
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
                                <Label htmlFor="campus_email">
                                    {__('Campus Email')}
                                </Label>
                                <Input
                                    id="campus_email"
                                    type="email"
                                    value={data.campus_email}
                                    onChange={(e) =>
                                        setData('campus_email', e.target.value)
                                    }
                                />
                                <InputError message={errors.campus_email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone_no">
                                    {__('Phone Number')}
                                </Label>
                                <Input
                                    id="phone_no"
                                    value={data.phone_no}
                                    onChange={(e) =>
                                        setData('phone_no', e.target.value)
                                    }
                                />
                                <InputError message={errors.phone_no} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg_date">
                                    {__('Registration Date')}
                                </Label>
                                <Input
                                    id="reg_date"
                                    type="date"
                                    value={data.reg_date}
                                    onChange={(e) =>
                                        setData('reg_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.reg_date} />
                            </div>
                        </div>
                    </div>

                    {/* Academic */}
                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            {__('Academic Information')}
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="dept">{__('Department')}</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(v) =>
                                        setData('department_id', v)
                                    }
                                >
                                    <SelectTrigger id="dept">
                                        <SelectValue
                                            placeholder={__(
                                                'Select department',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={d.id}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="advisor">
                                    {__('Academic Advisor')}
                                </Label>
                                <Select
                                    value={data.advisor_id || 'none'}
                                    onValueChange={(v) =>
                                        setData(
                                            'advisor_id',
                                            v === 'none' ? null : v,
                                        )
                                    }
                                >
                                    <SelectTrigger id="advisor">
                                        <SelectValue
                                            placeholder={__('Select advisor')}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            {__('None')}
                                        </SelectItem>
                                        {advisors.map((a) => (
                                            <SelectItem key={a.id} value={a.id}>
                                                {a.employee?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.advisor_id} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year">{__('Entry Year')}</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={data.year}
                                    onChange={(e) =>
                                        setData(
                                            'year',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                />
                                <InputError message={errors.year} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">{__('Status')}</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            'active',
                                            'inactive',
                                            'graduated',
                                            'withdrawn',
                                            'on_leave',
                                        ].map((s) => (
                                            <SelectItem
                                                key={s}
                                                value={s}
                                                className="capitalize"
                                            >
                                                {statusLabels[s] ?? s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    </div>

                    {/* Personal */}
                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            {__('Personal Background')}
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="bp">{__('Birth Place')}</Label>
                                <Input
                                    id="bp"
                                    value={data.birth_place}
                                    onChange={(e) =>
                                        setData('birth_place', e.target.value)
                                    }
                                />
                                <InputError message={errors.birth_place} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bd">{__('Birth Date')}</Label>
                                <Input
                                    id="bd"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) =>
                                        setData('birth_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.birth_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">{__('Gender')}</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(v) => setData('gender', v)}
                                >
                                    <SelectTrigger>
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
                            <div className="space-y-2">
                                <Label htmlFor="religion">
                                    {__('Religion')}
                                </Label>
                                <Select
                                    value={data.religion}
                                    onValueChange={(v) =>
                                        setData('religion', v)
                                    }
                                >
                                    <SelectTrigger id="religion">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {religionOptions.map((r) => (
                                            <SelectItem
                                                key={r.value}
                                                value={r.value}
                                            >
                                                {r.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.religion} />
                            </div>
                        </div>
                    </div>

                    {/* Home Address */}
                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            {__('Home Address')}
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="home_address">
                                    {__('Street Address')}
                                </Label>
                                <Input
                                    id="home_address"
                                    value={data.home_address}
                                    onChange={(e) =>
                                        setData('home_address', e.target.value)
                                    }
                                />
                                <InputError message={errors.home_address} />
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="home_town">
                                        {__('Town/City')}
                                    </Label>
                                    <Input
                                        id="home_town"
                                        value={data.home_town}
                                        onChange={(e) =>
                                            setData('home_town', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.home_town} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="home_province">
                                        {__('Province')}
                                    </Label>
                                    <Input
                                        id="home_province"
                                        value={data.home_province}
                                        onChange={(e) =>
                                            setData(
                                                'home_province',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.home_province}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="home_postalcode">
                                        {__('Postal Code')}
                                    </Label>
                                    <Input
                                        id="home_postalcode"
                                        value={data.home_postalcode}
                                        onChange={(e) =>
                                            setData(
                                                'home_postalcode',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.home_postalcode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Address */}
                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-lg font-semibold">
                                {__('Current Address')}
                            </h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() =>
                                    setData({
                                        ...data,
                                        current_address: data.home_address,
                                        current_town: data.home_town,
                                        current_province: data.home_province,
                                        current_postalcode:
                                            data.home_postalcode,
                                    })
                                }
                            >
                                {__('Copy from Home Address')}
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_address">
                                    {__('Street Address')}
                                </Label>
                                <Input
                                    id="current_address"
                                    value={data.current_address}
                                    onChange={(e) =>
                                        setData(
                                            'current_address',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.current_address} />
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="current_town">
                                        {__('Town/City')}
                                    </Label>
                                    <Input
                                        id="current_town"
                                        value={data.current_town}
                                        onChange={(e) =>
                                            setData(
                                                'current_town',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={errors.current_town} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="current_province">
                                        {__('Province')}
                                    </Label>
                                    <Input
                                        id="current_province"
                                        value={data.current_province}
                                        onChange={(e) =>
                                            setData(
                                                'current_province',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.current_province}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="current_postalcode">
                                        {__('Postal Code')}
                                    </Label>
                                    <Input
                                        id="current_postalcode"
                                        value={data.current_postalcode}
                                        onChange={(e) =>
                                            setData(
                                                'current_postalcode',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.current_postalcode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Photo */}
                    <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            {__('Photo')}
                        </h3>
                        <div className="grid gap-2">
                            <Label htmlFor="st_photo">
                                {__('Student Photo')}
                            </Label>
                            <Input
                                id="st_photo"
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'photo',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            <InputError message={errors.photo} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href={studentsIndex()}>{__('Cancel')}</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {__('Create Student Record')}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
