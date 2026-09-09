import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    UserRound,
    GraduationCap,
    Building,
    Phone,
    Mail,
    MapPin,
    Calendar,
    FileText,
    UserPlus,
    Info,
    Home,
} from 'lucide-react';
import type { FormEvent } from 'react';
import StudentController from '@/actions/App/Http/Controllers/Hr/StudentController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { index as studentsIndex } from '@/routes/students';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
    student: any;
};

export default function StudentShow({ student }: PageProps) {
    if (!student) {
return null;
}

    return (
        <>
            <Head title={`Student: ${student.name}`} />
            <div className="mx-auto flex h-full max-w-7xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={studentsIndex()}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" /> Back to Students
                        </Link>
                        <Heading
                            title={student.name}
                            description={`Student Profile • Class of ${student.year}`}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Badge
                            variant={
                                student.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                            }
                            className="h-8 px-3 uppercase"
                        >
                            {student.status}
                        </Badge>
                        <Badge variant="outline" className="h-8 px-3 font-mono">
                            {student.reg_no}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Profile & Contact Card */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                            <div className="relative mb-4 flex size-32 items-center justify-center overflow-hidden rounded-full border-2 border-muted bg-muted">
                                {student.photo ? (
                                    <img
                                        src={`/storage/${student.photo}`}
                                        alt={student.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserRound className="size-16 text-muted-foreground" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold">
                                {student.name}
                            </h3>
                            <p className="font-mono text-sm text-muted-foreground">
                                {student.reg_no}
                            </p>

                            <div className="mt-6 w-full space-y-3 border-t pt-6 text-left">
                                <div className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    <Mail className="size-4 shrink-0" />
                                    <span className="truncate">
                                        {student.email}
                                    </span>
                                </div>
                                {student.campus_email && (
                                    <div className="group flex items-center gap-3 text-sm text-muted-foreground">
                                        <GraduationCap className="size-4 shrink-0 text-primary" />
                                        <span className="truncate font-medium text-primary">
                                            {student.campus_email}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Phone className="size-4 shrink-0" />
                                    <span>{student.phone_no || '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h4 className="flex items-center gap-2 border-b pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                <Info className="size-3" />
                                Academic Information
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                                        Department
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Building className="size-3.5 text-muted-foreground" />
                                        <p className="text-sm leading-none font-medium">
                                            {student.department?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                                        Academic Advisor
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="size-3.5 text-muted-foreground" />
                                        <p className="text-sm leading-none font-medium">
                                            {student.advisor?.employee?.name ||
                                                'Not Assigned'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                                        Registration Date
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3.5 text-muted-foreground" />
                                        <p className="text-sm leading-none">
                                            {student.reg_date
                                                ? new Date(
                                                      student.reg_date,
                                                  ).toLocaleDateString(
                                                      'en-GB',
                                                      { dateStyle: 'long' },
                                                  )
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Data */}
                    <div className="space-y-6 lg:col-span-8">
                        <div className="grid gap-8 rounded-lg border bg-card p-6 shadow-sm md:grid-cols-2">
                            <div className="space-y-6">
                                <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold">
                                    <UserRound className="size-5 text-primary" />
                                    Personal Bio
                                </h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Place of Birth
                                        </span>
                                        <span className="text-right text-sm font-medium">
                                            {student.birth_place}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Date of Birth
                                        </span>
                                        <span className="text-right text-sm font-medium">
                                            {student.birth_date
                                                ? new Date(
                                                      student.birth_date,
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Gender / Religion
                                        </span>
                                        <span className="text-right text-sm font-medium capitalize">
                                            {student.gender} /{' '}
                                            {student.religion}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Marital Status
                                        </span>
                                        <span className="text-right text-sm font-medium capitalize">
                                            {student.marital_status || 'Single'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-semibold">
                                    <MapPin className="size-5 text-primary" />
                                    Residence Information
                                </h3>
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <Home className="size-3 text-muted-foreground" />
                                            <Label className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                                                Home Town Address
                                            </Label>
                                        </div>
                                        <p className="mt-1 border-l-2 border-muted pl-4.5 text-sm leading-relaxed">
                                            {student.home_address || '-'}
                                        </p>
                                        <p className="mt-1 pl-4.5 text-xs text-muted-foreground">
                                            {student.home_town},{' '}
                                            {student.home_province}{' '}
                                            {student.home_postalcode}
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="size-3 text-muted-foreground" />
                                            <Label className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                                                Current Residence
                                            </Label>
                                        </div>
                                        <p className="mt-1 border-l-2 border-primary/30 pl-4.5 text-sm leading-relaxed">
                                            {student.current_address ||
                                                'Same as home address'}
                                        </p>
                                        <p className="mt-1 pl-4.5 text-xs text-muted-foreground">
                                            {student.current_town},{' '}
                                            {student.current_province}{' '}
                                            {student.current_postalcode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder for future sub-modules */}
                        <div className="flex flex-col items-center rounded-lg border-2 border-dashed bg-muted/20 p-10 text-center">
                            <Calendar className="mb-3 size-10 text-muted-foreground/40" />
                            <h4 className="font-semibold text-muted-foreground">
                                Academic History & Enrollment
                            </h4>
                            <p className="mx-auto max-w-xs text-sm text-muted-foreground/60">
                                This section will manage course enrollments,
                                semester statuses, and academic transcripts in
                                future updates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StudentShow.layout = {
    breadcrumbs: [
        { title: 'Students', href: studentsIndex() },
        { title: 'Detail', href: '' },
    ],
};
