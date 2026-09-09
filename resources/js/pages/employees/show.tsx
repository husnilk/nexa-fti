import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    UserRound,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Award,
    GraduationCap,
    Plus,
    Pencil,
    Trash2,
    Download,
    History,
    FileText,
    Tags,
    Users,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import EmployeeCertificationController from '@/actions/App/Http/Controllers/Hr/EmployeeCertificationController';
import EmployeeEducationHistoryController from '@/actions/App/Http/Controllers/Hr/EmployeeEducationHistoryController';
import EmployeeFamilyMemberController from '@/actions/App/Http/Controllers/Hr/EmployeeFamilyMemberController';
import EmployeePositionHistoryController from '@/actions/App/Http/Controllers/Hr/EmployeePositionHistoryController';
import EmployeeRankHistoryController from '@/actions/App/Http/Controllers/Hr/EmployeeRankHistoryController';
import NomenclatureClassificationHistoryController from '@/actions/App/Http/Controllers/Hr/NomenclatureClassificationHistoryController';
import PositionFunctionalHistoryController from '@/actions/App/Http/Controllers/Hr/PositionFunctionalHistoryController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { index as employeesIndex } from '@/routes/employees';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
    employee: any;
    positions: any[];
    functionalPositions: any[];
    nomenclatureClassifications: any[];
    ranks: any[];
};

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

export default function EmployeeShow({
    auth,
    employee,
    positions,
    functionalPositions,
    nomenclatureClassifications,
    ranks,
}: PageProps) {
    const canManageCert = auth?.roles?.includes('super-admin') || auth?.permissions?.includes('hr.manage');

    if (!employee) {
return null;
}

    const isLecturer = !!employee.lecturer;
    const isStaff = !!employee.staff;

    // Position History State
    const [isCreatingPos, setIsCreatingPos] = useState(false);
    const [editingPos, setEditingPos] = useState<any | null>(null);
    const [deletingPos, setDeletingPos] = useState<any | null>(null);

    const posForm = useForm({
        employee_id: employee.id,
        position_id: '',
        start_date: '',
        end_date: '',
        decree_number: '',
        decree_date: '',
        document: null as File | null,
    });

    // Education History State
    const [isCreatingEdu, setIsCreatingEdu] = useState(false);
    const [editingEdu, setEditingEdu] = useState<any | null>(null);
    const [deletingEdu, setDeletingEdu] = useState<any | null>(null);

    // Certification State
    const [isCreatingCert, setIsCreatingCert] = useState(false);
    const [editingCert, setEditingCert] = useState<any | null>(null);
    const [deletingCert, setDeletingCert] = useState<any | null>(null);

    const eduForm = useForm({
        employee_id: employee.id,
        degree: '',
        institution: '',
        major: '',
        start_year: '',
        end_year: '',
        gpa: '',
        certificate_file: null as File | null,
    });

    const certForm = useForm({
        employee_id: employee.id,
        name: '',
        institution: '',
        certification_number: '',
        issue_date: '',
        expiry_date: '',
        certificate_file: null as File | null,
    });

    // Functional Position History State
    const [isCreatingFunc, setIsCreatingFunc] = useState(false);
    const [editingFunc, setEditingFunc] = useState<any | null>(null);
    const [deletingFunc, setDeletingFunc] = useState<any | null>(null);

    const funcForm = useForm({
        lecturer_id: employee.lecturer?.id,
        functional_position_id: '',
        start_date: '',
        decree_number: '',
        decree_date: '',
        decree_signer: '',
        certificate_file: null as File | null,
    });

    // Nomenclature Classification History State
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [editingClass, setEditingClass] = useState<any | null>(null);
    const [deletingClass, setDeletingClass] = useState<any | null>(null);

    const classForm = useForm({
        staff_id: employee.staff?.id,
        nomenclature_classification_id: '',
        start_date: '',
        end_date: '',
        decree_number: '',
        decree_date: '',
        decree_signer: '',
        decree_file: null as File | null,
    });

    // Family Member State
    const [isCreatingFamily, setIsCreatingFamily] = useState(false);
    const [editingFamily, setEditingFamily] = useState<any | null>(null);
    const [deletingFamily, setDeletingFamily] = useState<any | null>(null);

    const familyForm = useForm({
        employee_id: employee.id,
        name: '',
        relationship: 'spouse',
        gender: 'male',
        birth_place: '',
        birth_date: '',
        id_card_number: '',
        occupation: '',
        phone: '',
        is_dependent: false,
        notes: '',
    });

    // Rank History State
    const [isCreatingRank, setIsCreatingRank] = useState(false);
    const [editingRankHist, setEditingRankHist] = useState<any | null>(null);
    const [deletingRankHist, setDeletingRankHist] = useState<any | null>(null);

    const rankHistForm = useForm({
        employee_id: employee.id,
        employee_rank_id: '',
        start_date: '',
        end_date: '',
        effective_date: '',
        decree_number: '',
        decree_date: '',
        decree_file: null as File | null,
        remarks: '',
    });

    const degrees = [
        'S3',
        'S2',
        'S1',
        'D4',
        'D3',
        'D1',
        'SLTA',
        'SMP',
        'SD',
        'TK',
    ];

    // Position Handlers
    function submitPos(e: FormEvent) {
        e.preventDefault();

        if (editingPos) {
            posForm.post(
                EmployeePositionHistoryController.update.url(editingPos.id),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setEditingPos(null);
                        posForm.reset();
                    },
                },
            );
        } else {
            posForm.post(EmployeePositionHistoryController.store.url(), {
                onSuccess: () => {
                    setIsCreatingPos(false);
                    posForm.reset();
                },
            });
        }
    }

    function openEditPos(hist: any) {
        setEditingPos(hist);
        posForm.setData({
            employee_id: employee.id,
            position_id: hist.position_id,
            start_date: hist.start_date,
            end_date: hist.end_date || '',
            decree_number: hist.decree_number,
            decree_date: hist.decree_date,
            document: null,
        });
        posForm.clearErrors();
    }

    // Education Handlers
    function submitEdu(e: FormEvent) {
        e.preventDefault();

        if (editingEdu) {
            eduForm.post(
                EmployeeEducationHistoryController.update.url(editingEdu.id),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setEditingEdu(null);
                        eduForm.reset();
                    },
                },
            );
        } else {
            eduForm.post(EmployeeEducationHistoryController.store.url(), {
                onSuccess: () => {
                    setIsCreatingEdu(false);
                    eduForm.reset();
                },
            });
        }
    }

    function openEditEdu(hist: any) {
        setEditingEdu(hist);
        eduForm.setData({
            employee_id: employee.id,
            degree: hist.degree,
            institution: hist.institution,
            major: hist.major || '',
            start_year: hist.start_year.toString(),
            end_year: hist.end_year.toString(),
            gpa: hist.gpa?.toString() || '',
            certificate_file: null,
        });
        eduForm.clearErrors();
    }

    // Certification Handlers
    function submitCert(e: FormEvent) {
        e.preventDefault();

        if (editingCert) {
            certForm.post(
                EmployeeCertificationController.update.url(editingCert.id),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setEditingCert(null);
                        certForm.reset();
                    },
                },
            );
        } else {
            certForm.post(EmployeeCertificationController.store.url(), {
                onSuccess: () => {
                    setIsCreatingCert(false);
                    certForm.reset();
                },
            });
        }
    }

    function openEditCert(cert: any) {
        setEditingCert(cert);
        certForm.setData({
            employee_id: employee.id,
            name: cert.name,
            institution: cert.institution,
            certification_number: cert.certification_number || '',
            issue_date: cert.issue_date ? cert.issue_date.substring(0, 10) : '',
            expiry_date: cert.expiry_date ? cert.expiry_date.substring(0, 10) : '',
            certificate_file: null,
        });
        certForm.clearErrors();
    }

    // Functional Position Handlers
    function submitFunc(e: FormEvent) {
        e.preventDefault();

        if (editingFunc) {
            funcForm.post(
                PositionFunctionalHistoryController.update.url(editingFunc.id),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setEditingFunc(null);
                        funcForm.reset();
                    },
                },
            );
        } else {
            funcForm.post(PositionFunctionalHistoryController.store.url(), {
                onSuccess: () => {
                    setIsCreatingFunc(false);
                    funcForm.reset();
                },
            });
        }
    }

    function openEditFunc(hist: any) {
        setEditingFunc(hist);
        funcForm.setData({
            lecturer_id: employee.lecturer.id,
            functional_position_id: hist.functional_position_id,
            start_date: hist.start_date,
            decree_number: hist.decree_number,
            decree_date: hist.decree_date,
            decree_signer: hist.decree_signer,
            certificate_file: null,
        });
        funcForm.clearErrors();
    }

    // Classification Handlers
    function submitClass(e: FormEvent) {
        e.preventDefault();

        if (editingClass) {
            classForm.post(
                NomenclatureClassificationHistoryController.update.url(
                    editingClass.id,
                ),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setEditingClass(null);
                        classForm.reset();
                    },
                },
            );
        } else {
            classForm.post(
                NomenclatureClassificationHistoryController.store.url(),
                {
                    onSuccess: () => {
                        setIsCreatingClass(false);
                        classForm.reset();
                    },
                },
            );
        }
    }

    function openEditClass(hist: any) {
        setEditingClass(hist);
        classForm.setData({
            staff_id: employee.staff.id,
            nomenclature_classification_id: hist.nomenclature_classification_id,
            start_date: hist.start_date,
            end_date: hist.end_date || '',
            decree_number: hist.decree_number,
            decree_date: hist.decree_date,
            decree_signer: hist.decree_signer,
            decree_file: null,
        });
        classForm.clearErrors();
    }

    // Family Member Handlers
    function submitFamily(e: React.FormEvent) {
        e.preventDefault();

        if (editingFamily) {
            familyForm.patch(
                EmployeeFamilyMemberController.update.url(editingFamily.id),
                {
                    onSuccess: () => {
                        setEditingFamily(null);
                        familyForm.reset();
                    },
                },
            );
        } else {
            familyForm.post(EmployeeFamilyMemberController.store.url(), {
                onSuccess: () => {
                    setIsCreatingFamily(false);
                    familyForm.reset();
                    familyForm.setData('employee_id', employee.id);
                },
            });
        }
    }

    function openEditFamily(member: any) {
        setEditingFamily(member);
        familyForm.setData({
            employee_id: employee.id,
            name: member.name,
            relationship: member.relationship,
            gender: member.gender,
            birth_place: member.birth_place || '',
            birth_date: member.birth_date ? member.birth_date.substring(0, 10) : '',
            id_card_number: member.id_card_number || '',
            occupation: member.occupation || '',
            phone: member.phone || '',
            is_dependent: member.is_dependent,
            notes: member.notes || '',
        });
        familyForm.clearErrors();
    }

    // Rank History Handlers
    function submitRankHist(e: FormEvent) {
        e.preventDefault();

        if (editingRankHist) {
            rankHistForm.post(
                EmployeeRankHistoryController.update.url(editingRankHist.id),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setEditingRankHist(null);
                        rankHistForm.reset();
                    },
                },
            );
        } else {
            rankHistForm.post(EmployeeRankHistoryController.store.url(), {
                onSuccess: () => {
                    setIsCreatingRank(false);
                    rankHistForm.reset();
                },
            });
        }
    }

    function openEditRankHist(hist: any) {
        setEditingRankHist(hist);
        rankHistForm.setData({
            employee_id: employee.id,
            employee_rank_id: hist.employee_rank_id,
            start_date: hist.start_date,
            end_date: hist.end_date || '',
            effective_date: hist.effective_date,
            decree_number: hist.decree_number,
            decree_date: hist.decree_date,
            decree_file: null,
            remarks: hist.remarks || '',
        });
        rankHistForm.clearErrors();
    }

    return (
        <>
            <Head title={`Employee: ${employee.name}`} />
            <div className="mx-auto flex h-full max-w-7xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={employeesIndex()}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" /> Back to Employees
                        </Link>
                        <Heading
                            title={employee.name}
                            description={`${isLecturer ? 'Lecturer' : 'Staff'} • ${employee.emp_number}`}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Badge
                            variant={
                                employee.status === 1 ? 'default' : 'secondary'
                            }
                            className="h-8 px-3 uppercase"
                        >
                            {employee.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="h-8 px-3">
                            {employee.employment_type?.employee_type?.name ||
                                'N/A'}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Left Column: Profile Card */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                            <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-muted">
                                <UserRound className="size-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">
                                {employee.name}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {employee.email}
                            </p>
                            <div className="w-full space-y-3 border-t pt-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    <Mail className="size-4 shrink-0" />
                                    <span className="truncate">
                                        {employee.email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Phone className="size-4 shrink-0" />
                                    <span>{employee.phone || '-'}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <MapPin className="mt-0.5 size-4 shrink-0" />
                                    <span className="flex-1">
                                        {employee.address || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h4 className="border-b pb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                Professional Specification
                            </h4>
                            {isLecturer ? (
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">
                                            Academic Rank
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {employee.lecturer.academic_rank ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">
                                            Functional Position
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {employee.lecturer
                                                .functional_position?.name ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">
                                            NUPTK
                                        </Label>
                                        <p className="font-mono text-sm">
                                            {employee.lecturer.nuptk || '-'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">
                                            Structural Position
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {employee.staff?.position?.name ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">
                                            Key Skills
                                        </Label>
                                        <p className="text-xs leading-relaxed text-muted-foreground italic">
                                            {employee.staff?.skills || '-'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Histories */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Functional Position History (Lecturers Only) */}
                        {isLecturer && (
                            <div className="rounded-lg border border-t-4 border-t-indigo-500 bg-card p-6 shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                                        <Award className="size-5 text-indigo-500" />
                                        Functional Position History
                                    </h3>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                        onClick={() => setIsCreatingFunc(true)}
                                    >
                                        <Plus className="mr-1 size-4" /> Add
                                        Record
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {employee.lecturer
                                        .functional_position_histories &&
                                    employee.lecturer
                                        .functional_position_histories.length >
                                        0 ? (
                                        <div className="grid gap-4">
                                            {employee.lecturer.functional_position_histories.map(
                                                (hist: any) => (
                                                    <div
                                                        key={hist.id}
                                                        className="group flex items-center justify-between rounded-lg border bg-indigo-50/20 p-4 transition-all hover:border-indigo-300"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="rounded-full border border-indigo-100 bg-white p-2 shadow-sm">
                                                                <Award className="size-5 text-indigo-500" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-indigo-900">
                                                                    {
                                                                        hist
                                                                            .functional_position
                                                                            ?.name
                                                                    }
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Effective
                                                                    from{' '}
                                                                    {shortDateFormatter.format(
                                                                        new Date(
                                                                            hist.start_date,
                                                                        ),
                                                                    )}{' '}
                                                                    • SK:{' '}
                                                                    {
                                                                        hist.decree_number
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            {hist.certificate_file && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={`/storage/${hist.certificate_file}`}
                                                                        target="_blank"
                                                                    >
                                                                        <Download className="size-3.5" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                onClick={() =>
                                                                    openEditFunc(
                                                                        hist,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-destructive"
                                                                onClick={() =>
                                                                    setDeletingFunc(
                                                                        hist,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground italic">
                                            No functional position history
                                            recorded.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Nomenclature Classification History (Staff Only) */}
                        {isStaff && (
                            <div className="rounded-lg border border-t-4 border-t-amber-500 bg-card p-6 shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                                        <Tags className="size-5 text-amber-500" />
                                        Classification History
                                    </h3>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-amber-200 text-amber-600 hover:bg-amber-50"
                                        onClick={() => setIsCreatingClass(true)}
                                    >
                                        <Plus className="mr-1 size-4" /> Add
                                        Record
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {employee.staff
                                        .nomenclature_classification_histories &&
                                    employee.staff
                                        .nomenclature_classification_histories
                                        .length > 0 ? (
                                        <div className="grid gap-4">
                                            {employee.staff.nomenclature_classification_histories.map(
                                                (hist: any) => (
                                                    <div
                                                        key={hist.id}
                                                        className="group flex items-center justify-between rounded-lg border bg-amber-50/20 p-4 transition-all hover:border-amber-300"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="rounded-full border border-amber-100 bg-white p-2 shadow-sm">
                                                                <Tags className="size-5 text-amber-500" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-amber-900">
                                                                    {
                                                                        hist
                                                                            .nomenclature_classification
                                                                            ?.name
                                                                    }
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {shortDateFormatter.format(
                                                                        new Date(
                                                                            hist.start_date,
                                                                        ),
                                                                    )}{' '}
                                                                    —{' '}
                                                                    {hist.end_date
                                                                        ? shortDateFormatter.format(
                                                                              new Date(
                                                                                  hist.end_date,
                                                                              ),
                                                                          )
                                                                        : 'Present'}
                                                                </p>
                                                                <p className="mt-1 text-[10px] text-muted-foreground">
                                                                    SK:{' '}
                                                                    {
                                                                        hist.decree_number
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            {hist.decree_file && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={`/storage/${hist.decree_file}`}
                                                                        target="_blank"
                                                                    >
                                                                        <Download className="size-3.5" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                onClick={() =>
                                                                    openEditClass(
                                                                        hist,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-destructive"
                                                                onClick={() =>
                                                                    setDeletingClass(
                                                                        hist,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground italic">
                                            No classification history recorded.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Position History */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <History className="size-5 text-primary" />
                                    Structural Career History
                                </h3>
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreatingPos(true)}
                                >
                                    <Plus className="mr-1 size-4" /> Add Record
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {employee.position_histories &&
                                employee.position_histories.length > 0 ? (
                                    <div className="relative ml-3 space-y-8 border-l border-muted-foreground/20 pl-6">
                                        {employee.position_histories.map(
                                            (hist: any) => (
                                                <div
                                                    key={hist.id}
                                                    className="relative"
                                                >
                                                    <div className="absolute top-0 -left-[31px] size-4 rounded-full border-2 border-primary bg-background" />
                                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                                        <div>
                                                            <h4 className="mb-1 text-base leading-none font-bold">
                                                                {hist.position
                                                                    ?.name ||
                                                                    'Unknown Position'}
                                                            </h4>
                                                            <p className="mb-2 text-xs text-muted-foreground">
                                                                {shortDateFormatter.format(
                                                                    new Date(
                                                                        hist.start_date,
                                                                    ),
                                                                )}{' '}
                                                                —{' '}
                                                                {hist.end_date
                                                                    ? shortDateFormatter.format(
                                                                          new Date(
                                                                              hist.end_date,
                                                                          ),
                                                                      )
                                                                    : 'Present'}
                                                            </p>
                                                            <div className="grid grid-cols-1 gap-x-6 gap-y-1 rounded border border-sidebar-border bg-muted/30 p-2 text-xs sm:grid-cols-2">
                                                                <div>
                                                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                                                        SK Num:
                                                                    </span>{' '}
                                                                    {
                                                                        hist.decree_number
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                                                        SK Date:
                                                                    </span>{' '}
                                                                    {shortDateFormatter.format(
                                                                        new Date(
                                                                            hist.decree_date,
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {hist.document && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="size-8"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={`/storage/${hist.document}`}
                                                                        target="_blank"
                                                                        title="Download Document"
                                                                    >
                                                                        <Download className="size-3.5" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                onClick={() =>
                                                                    openEditPos(
                                                                        hist,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 text-destructive"
                                                                onClick={() =>
                                                                    setDeletingPos(
                                                                        hist,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground italic">
                                        No position history recorded.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Education History */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <GraduationCap className="size-5 text-primary" />
                                    Education Background
                                </h3>
                                <Button
                                    size="sm"
                                    onClick={() => setIsCreatingEdu(true)}
                                >
                                    <Plus className="mr-1 size-4" /> Add Degree
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {employee.education_histories &&
                                employee.education_histories.length > 0 ? (
                                    employee.education_histories.map(
                                        (hist: any) => (
                                            <div
                                                key={hist.id}
                                                className="group relative flex items-start gap-4 rounded-md border bg-muted/10 p-4 transition-colors hover:border-primary/50"
                                            >
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded bg-muted">
                                                    <span className="text-xs font-bold">
                                                        {hist.degree}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-semibold">
                                                        {hist.institution}
                                                    </h4>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {hist.major || 'N/A'}
                                                    </p>
                                                    <p className="mt-1 font-mono text-[10px]">
                                                        {hist.start_year} —{' '}
                                                        {hist.end_year} • GPA:{' '}
                                                        {hist.gpa || '-'}
                                                    </p>
                                                </div>
                                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    {hist.certificate_file && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7"
                                                            asChild
                                                        >
                                                            <a
                                                                href={`/storage/${hist.certificate_file}`}
                                                                target="_blank"
                                                            >
                                                                <Download className="size-3" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                        onClick={() =>
                                                            openEditEdu(hist)
                                                        }
                                                    >
                                                        <Pencil className="size-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7 text-destructive"
                                                        onClick={() =>
                                                            setDeletingEdu(hist)
                                                        }
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="col-span-full rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground italic">
                                        No education records found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <Award className="size-5 text-primary" />
                                    Certifications
                                </h3>
                                {canManageCert && (
                                    <Button
                                        size="sm"
                                        onClick={() => setIsCreatingCert(true)}
                                    >
                                        <Plus className="mr-1 size-4" /> Add Certification
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {employee.certifications &&
                                employee.certifications.length > 0 ? (
                                    employee.certifications.map(
                                        (cert: any) => (
                                            <div
                                                key={cert.id}
                                                className="group relative flex items-start gap-4 rounded-md border bg-muted/10 p-4 transition-colors hover:border-primary/50"
                                            >
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded bg-muted">
                                                    <Award className="size-5 text-muted-foreground" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-semibold">
                                                        {cert.name}
                                                    </h4>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {cert.institution}
                                                    </p>
                                                    {cert.certification_number && (
                                                        <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                                                            No: {cert.certification_number}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 font-mono text-[10px]">
                                                        Issued: {cert.issue_date ? shortDateFormatter.format(new Date(cert.issue_date)) : '-'} • 
                                                        Expiry: {cert.expiry_date ? shortDateFormatter.format(new Date(cert.expiry_date)) : 'No Expiry'}
                                                    </p>
                                                </div>
                                                {canManageCert && (
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        {cert.certificate_file && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-7"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={`/storage/${cert.certificate_file}`}
                                                                    target="_blank"
                                                                >
                                                                    <Download className="size-3" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7"
                                                            onClick={() =>
                                                                openEditCert(cert)
                                                            }
                                                        >
                                                            <Pencil className="size-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7 text-destructive"
                                                            onClick={() =>
                                                                setDeletingCert(cert)
                                                            }
                                                        >
                                                            <Trash2 className="size-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <div className="col-span-full rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground italic">
                                        No certifications found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Family Members */}
                        <div className="rounded-lg border border-t-4 border-t-emerald-500 bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <Users className="size-5 text-emerald-500" />
                                    Family Members
                                </h3>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                    onClick={() => setIsCreatingFamily(true)}
                                >
                                    <Plus className="mr-1 size-4" /> Add Member
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {employee.family_members && employee.family_members.length > 0 ? (
                                    <div className="grid gap-3">
                                        {employee.family_members.map((member: any) => (
                                            <div
                                                key={member.id}
                                                className="group flex items-center justify-between rounded-lg border bg-emerald-50/20 p-4 transition-all hover:border-emerald-300"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="rounded-full border border-emerald-100 bg-white p-2 shadow-sm">
                                                        <Users className="size-5 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-bold text-emerald-900">
                                                                {member.name}
                                                            </h4>
                                                            {member.is_dependent && (
                                                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase">
                                                                    Dependent
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground capitalize">
                                                            {member.relationship} • {member.gender}
                                                            {member.birth_date && ` • Born ${shortDateFormatter.format(new Date(member.birth_date))}`}
                                                        </p>
                                                        {member.occupation && (
                                                            <p className="text-xs text-muted-foreground italic">
                                                                {member.occupation}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() => openEditFamily(member)}
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-destructive"
                                                        onClick={() => setDeletingFamily(member)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground italic">
                                        No family members recorded.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rank History */}
                        <div className="rounded-lg border border-t-4 border-t-blue-500 bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <History className="size-5 text-blue-500" />
                                    Rank History
                                </h3>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsCreatingRank(true)}
                                >
                                    <Plus className="mr-1 size-4" /> Add Record
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {employee.rank_histories && employee.rank_histories.length > 0 ? (
                                    <div className="grid gap-4">
                                        {employee.rank_histories.map((hist: any) => (
                                            <div
                                                key={hist.id}
                                                className="group relative flex flex-col gap-3 rounded-lg border bg-blue-50/10 p-4 transition-all hover:border-blue-300"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="rounded-full border border-blue-100 bg-white p-2 shadow-sm">
                                                            <History className="size-5 text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-blue-900">
                                                                {hist.rank?.name} ({hist.rank?.code})
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {shortDateFormatter.format(new Date(hist.start_date))} —{' '}
                                                                {hist.end_date
                                                                    ? shortDateFormatter.format(new Date(hist.end_date))
                                                                    : 'Present'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        {hist.decree_file && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={`/storage/${hist.decree_file}`}
                                                                    target="_blank"
                                                                    title="Download Decree"
                                                                >
                                                                    <Download className="size-3.5" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() => openEditRankHist(hist)}
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive"
                                                            onClick={() => setDeletingRankHist(hist)}
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-x-6 gap-y-1 rounded border border-blue-100 bg-blue-50/5 p-2 text-xs sm:grid-cols-2">
                                                    <div>
                                                        <span className="font-semibold text-muted-foreground">Effective Date:</span>{' '}
                                                        {shortDateFormatter.format(new Date(hist.effective_date))}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-muted-foreground">Decree Number:</span>{' '}
                                                        {hist.decree_number}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-muted-foreground">Decree Date:</span>{' '}
                                                        {shortDateFormatter.format(new Date(hist.decree_date))}
                                                    </div>
                                                    {hist.remarks && (
                                                        <div className="col-span-full mt-1 border-t pt-1 italic text-muted-foreground">
                                                            {hist.remarks}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground italic">
                                        No rank history recorded.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Position History Dialog */}
            <Dialog
                open={isCreatingPos || editingPos !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreatingPos(false);
                        setEditingPos(null);
                        posForm.reset();
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPos
                                ? 'Edit Career Record'
                                : 'Add Career Record'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPos} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pos_id">Position</Label>
                            <Select
                                value={posForm.data.position_id}
                                onValueChange={(v) =>
                                    posForm.setData('position_id', v)
                                }
                            >
                                <SelectTrigger id="pos_id">
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(positions || []).map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={posForm.errors.position_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={posForm.data.start_date}
                                    onChange={(e) =>
                                        posForm.setData(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={posForm.errors.start_date}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">
                                    End Date (Optional)
                                </Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={posForm.data.end_date}
                                    onChange={(e) =>
                                        posForm.setData(
                                            'end_date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dec_num">Decree (SK) Number</Label>
                            <Input
                                id="dec_num"
                                value={posForm.data.decree_number}
                                onChange={(e) =>
                                    posForm.setData(
                                        'decree_number',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. 123/SK/2026"
                            />
                            <InputError
                                message={posForm.errors.decree_number}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dec_date">Decree (SK) Date</Label>
                            <Input
                                id="dec_date"
                                type="date"
                                value={posForm.data.decree_date}
                                onChange={(e) =>
                                    posForm.setData(
                                        'decree_date',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={posForm.errors.decree_date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="pos_doc">
                                Document (PDF/JPG/PNG)
                            </Label>
                            <Input
                                id="pos_doc"
                                type="file"
                                onChange={(e) =>
                                    posForm.setData(
                                        'document',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            <InputError message={posForm.errors.document} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreatingPos(false);
                                    setEditingPos(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={posForm.processing}>
                                Save Record
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Functional Position History Dialog */}
            <Dialog
                open={isCreatingFunc || editingFunc !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreatingFunc(false);
                        setEditingFunc(null);
                        funcForm.reset();
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingFunc
                                ? 'Edit Functional History'
                                : 'Add Functional History'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitFunc} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="func_pos_id">
                                Functional Position
                            </Label>
                            <Select
                                value={funcForm.data.functional_position_id}
                                onValueChange={(v) =>
                                    funcForm.setData(
                                        'functional_position_id',
                                        v,
                                    )
                                }
                            >
                                <SelectTrigger id="func_pos_id">
                                    <SelectValue placeholder="Select functional position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {functionalPositions.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                            {f.name} (Lvl {f.level})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={funcForm.errors.functional_position_id}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="f_start_date">Start Date</Label>
                            <Input
                                id="f_start_date"
                                type="date"
                                value={funcForm.data.start_date}
                                onChange={(e) =>
                                    funcForm.setData(
                                        'start_date',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={funcForm.errors.start_date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="f_dec_num">
                                Decree (SK) Number
                            </Label>
                            <Input
                                id="f_dec_num"
                                value={funcForm.data.decree_number}
                                onChange={(e) =>
                                    funcForm.setData(
                                        'decree_number',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={funcForm.errors.decree_number}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="f_dec_date">
                                    Decree (SK) Date
                                </Label>
                                <Input
                                    id="f_dec_date"
                                    type="date"
                                    value={funcForm.data.decree_date}
                                    onChange={(e) =>
                                        funcForm.setData(
                                            'decree_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={funcForm.errors.decree_date}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="f_dec_signer">
                                    Decree Signer
                                </Label>
                                <Input
                                    id="f_dec_signer"
                                    value={funcForm.data.decree_signer}
                                    onChange={(e) =>
                                        funcForm.setData(
                                            'decree_signer',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={funcForm.errors.decree_signer}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="f_cert">Certificate/SK File</Label>
                            <Input
                                id="f_cert"
                                type="file"
                                onChange={(e) =>
                                    funcForm.setData(
                                        'certificate_file',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            <InputError
                                message={funcForm.errors.certificate_file}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreatingFunc(false);
                                    setEditingFunc(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={funcForm.processing}
                            >
                                Save functional record
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Classification History Dialog */}
            <Dialog
                open={isCreatingClass || editingClass !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreatingClass(false);
                        setEditingClass(null);
                        classForm.reset();
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingClass
                                ? 'Edit Classification History'
                                : 'Add Classification History'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitClass} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="class_id">Classification</Label>
                            <Select
                                value={
                                    classForm.data
                                        .nomenclature_classification_id
                                }
                                onValueChange={(v) =>
                                    classForm.setData(
                                        'nomenclature_classification_id',
                                        v,
                                    )
                                }
                            >
                                <SelectTrigger id="class_id">
                                    <SelectValue placeholder="Select classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    {nomenclatureClassifications.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={
                                    classForm.errors
                                        .nomenclature_classification_id
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="c_start_date">Start Date</Label>
                                <Input
                                    id="c_start_date"
                                    type="date"
                                    value={classForm.data.start_date}
                                    onChange={(e) =>
                                        classForm.setData(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={classForm.errors.start_date}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="c_end_date">
                                    End Date (Optional)
                                </Label>
                                <Input
                                    id="c_end_date"
                                    type="date"
                                    value={classForm.data.end_date}
                                    onChange={(e) =>
                                        classForm.setData(
                                            'end_date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="c_dec_num">Decree Number</Label>
                            <Input
                                id="c_dec_num"
                                value={classForm.data.decree_number}
                                onChange={(e) =>
                                    classForm.setData(
                                        'decree_number',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={classForm.errors.decree_number}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="c_dec_date">Decree Date</Label>
                                <Input
                                    id="c_dec_date"
                                    type="date"
                                    value={classForm.data.decree_date}
                                    onChange={(e) =>
                                        classForm.setData(
                                            'decree_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={classForm.errors.decree_date}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="c_dec_signer">
                                    Decree Signer
                                </Label>
                                <Input
                                    id="c_dec_signer"
                                    value={classForm.data.decree_signer}
                                    onChange={(e) =>
                                        classForm.setData(
                                            'decree_signer',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={classForm.errors.decree_signer}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="c_file">Decree File</Label>
                            <Input
                                id="c_file"
                                type="file"
                                onChange={(e) =>
                                    classForm.setData(
                                        'decree_file',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            <InputError
                                message={classForm.errors.decree_file}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreatingClass(false);
                                    setEditingClass(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={classForm.processing}
                            >
                                Save record
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Education History Dialog */}
            <Dialog
                open={isCreatingEdu || editingEdu !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreatingEdu(false);
                        setEditingEdu(null);
                        eduForm.reset();
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingEdu ? 'Edit Degree' : 'Add Degree'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdu} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Select
                                    value={eduForm.data.degree}
                                    onValueChange={(v) =>
                                        eduForm.setData('degree', v)
                                    }
                                >
                                    <SelectTrigger id="degree">
                                        <SelectValue placeholder="Degree" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {degrees.map((d) => (
                                            <SelectItem key={d} value={d}>
                                                {d}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={eduForm.errors.degree} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="major">Major</Label>
                                <Input
                                    id="major"
                                    value={eduForm.data.major}
                                    onChange={(e) =>
                                        eduForm.setData('major', e.target.value)
                                    }
                                />
                                <InputError message={eduForm.errors.major} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="inst">Institution</Label>
                            <Input
                                id="inst"
                                value={eduForm.data.institution}
                                onChange={(e) =>
                                    eduForm.setData(
                                        'institution',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={eduForm.errors.institution} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sy">Start Year</Label>
                                <Input
                                    id="sy"
                                    type="number"
                                    value={eduForm.data.start_year}
                                    onChange={(e) =>
                                        eduForm.setData(
                                            'start_year',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={eduForm.errors.start_year}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ey">End Year</Label>
                                <Input
                                    id="ey"
                                    type="number"
                                    value={eduForm.data.end_year}
                                    onChange={(e) =>
                                        eduForm.setData(
                                            'end_year',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={eduForm.errors.end_year} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gpa">GPA</Label>
                                <Input
                                    id="gpa"
                                    type="number"
                                    step="0.01"
                                    value={eduForm.data.gpa}
                                    onChange={(e) =>
                                        eduForm.setData('gpa', e.target.value)
                                    }
                                />
                                <InputError message={eduForm.errors.gpa} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edu_doc">
                                Certificate (PDF/JPG/PNG)
                            </Label>
                            <Input
                                id="edu_doc"
                                type="file"
                                onChange={(e) =>
                                    eduForm.setData(
                                        'certificate_file',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            <InputError
                                message={eduForm.errors.certificate_file}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreatingEdu(false);
                                    setEditingEdu(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={eduForm.processing}>
                                Save Degree
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Deletion Dialogs */}
            <Dialog
                open={deletingPos !== null}
                onOpenChange={(open) => !open && setDeletingPos(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Structural Record</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to remove this position record?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingPos(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                router.delete(
                                    EmployeePositionHistoryController.destroy.url(
                                        deletingPos.id,
                                    ),
                                    { onSuccess: () => setDeletingPos(null) },
                                )
                            }
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingFunc !== null}
                onOpenChange={(open) => !open && setDeletingFunc(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Functional Record</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to remove this functional record?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingFunc(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                router.delete(
                                    PositionFunctionalHistoryController.destroy.url(
                                        deletingFunc.id,
                                    ),
                                    { onSuccess: () => setDeletingFunc(null) },
                                )
                            }
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingClass !== null}
                onOpenChange={(open) => !open && setDeletingClass(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Classification Record</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to remove this classification
                        record?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingClass(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                router.delete(
                                    NomenclatureClassificationHistoryController.destroy.url(
                                        deletingClass.id,
                                    ),
                                    { onSuccess: () => setDeletingClass(null) },
                                )
                            }
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingEdu !== null}
                onOpenChange={(open) => !open && setDeletingEdu(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Education Record</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to remove this degree record?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingEdu(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                router.delete(
                                    EmployeeEducationHistoryController.destroy.url(
                                        deletingEdu.id,
                                    ),
                                    { onSuccess: () => setDeletingEdu(null) },
                                )
                            }
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Certification Dialog */}
            <Dialog
                open={isCreatingCert || editingCert !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreatingCert(false);
                        setEditingCert(null);
                        certForm.reset();
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCert ? 'Edit Certification' : 'Add Certification'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCert} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cert_name">Certification Name</Label>
                            <Input
                                id="cert_name"
                                value={certForm.data.name}
                                onChange={(e) =>
                                    certForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={certForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cert_inst">Issuing Organization / Institution</Label>
                            <Input
                                id="cert_inst"
                                value={certForm.data.institution}
                                onChange={(e) =>
                                    certForm.setData('institution', e.target.value)
                                }
                            />
                            <InputError message={certForm.errors.institution} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cert_num">Certification Number</Label>
                            <Input
                                id="cert_num"
                                value={certForm.data.certification_number}
                                onChange={(e) =>
                                    certForm.setData('certification_number', e.target.value)
                                }
                            />
                            <InputError message={certForm.errors.certification_number} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="issue_date">Issue Date</Label>
                                <Input
                                    id="issue_date"
                                    type="date"
                                    value={certForm.data.issue_date}
                                    onChange={(e) =>
                                        certForm.setData('issue_date', e.target.value)
                                    }
                                />
                                <InputError message={certForm.errors.issue_date} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="expiry_date">Expiry Date</Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={certForm.data.expiry_date}
                                    onChange={(e) =>
                                        certForm.setData('expiry_date', e.target.value)
                                    }
                                />
                                <InputError message={certForm.errors.expiry_date} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cert_doc">
                                Certificate Document (PDF/JPG/PNG)
                            </Label>
                            <Input
                                id="cert_doc"
                                type="file"
                                onChange={(e) =>
                                    certForm.setData(
                                        'certificate_file',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            <InputError message={certForm.errors.certificate_file} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreatingCert(false);
                                    setEditingCert(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={certForm.processing}>
                                Save Certification
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Certification Dialog */}
            <Dialog
                open={deletingCert !== null}
                onOpenChange={(open) => !open && setDeletingCert(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Certification</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to remove this certification record?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingCert(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                router.delete(
                                    EmployeeCertificationController.destroy.url(
                                        deletingCert.id,
                                    ),
                                    { onSuccess: () => setDeletingCert(null) },
                                )
                            }
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Family Member Dialog */}
            <Dialog
                open={isCreatingFamily || editingFamily !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreatingFamily(false);
                        setEditingFamily(null);
                        familyForm.reset();
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingFamily ? 'Edit Family Member' : 'Add Family Member'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitFamily} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fam_name">Name</Label>
                            <Input
                                id="fam_name"
                                value={familyForm.data.name}
                                onChange={(e) => familyForm.setData('name', e.target.value)}
                                placeholder="Full Name"
                                required
                            />
                            <InputError message={familyForm.errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fam_relationship">Relationship</Label>
                                <Select
                                    value={familyForm.data.relationship}
                                    onValueChange={(v) => familyForm.setData('relationship', v)}
                                >
                                    <SelectTrigger id="fam_relationship">
                                        <SelectValue placeholder="Relationship" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="spouse">Spouse</SelectItem>
                                        <SelectItem value="child">Child</SelectItem>
                                        <SelectItem value="parent">Parent</SelectItem>
                                        <SelectItem value="sibling">Sibling</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={familyForm.errors.relationship} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fam_gender">Gender</Label>
                                <Select
                                    value={familyForm.data.gender}
                                    onValueChange={(v) => familyForm.setData('gender', v)}
                                >
                                    <SelectTrigger id="fam_gender">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={familyForm.errors.gender} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fam_birth_place">Birth Place</Label>
                                <Input
                                    id="fam_birth_place"
                                    value={familyForm.data.birth_place}
                                    onChange={(e) => familyForm.setData('birth_place', e.target.value)}
                                    placeholder="Birth Place"
                                />
                                <InputError message={familyForm.errors.birth_place} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fam_birth_date">Birth Date</Label>
                                <Input
                                    id="fam_birth_date"
                                    type="date"
                                    value={familyForm.data.birth_date}
                                    onChange={(e) => familyForm.setData('birth_date', e.target.value)}
                                />
                                <InputError message={familyForm.errors.birth_date} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fam_id_card">ID Card Number (NIK)</Label>
                            <Input
                                id="fam_id_card"
                                value={familyForm.data.id_card_number}
                                onChange={(e) => familyForm.setData('id_card_number', e.target.value)}
                                placeholder="ID Card Number"
                            />
                            <InputError message={familyForm.errors.id_card_number} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fam_occupation">Occupation</Label>
                                <Input
                                    id="fam_occupation"
                                    value={familyForm.data.occupation}
                                    onChange={(e) => familyForm.setData('occupation', e.target.value)}
                                    placeholder="Occupation"
                                />
                                <InputError message={familyForm.errors.occupation} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fam_phone">Phone</Label>
                                <Input
                                    id="fam_phone"
                                    value={familyForm.data.phone}
                                    onChange={(e) => familyForm.setData('phone', e.target.value)}
                                    placeholder="Phone Number"
                                />
                                <InputError message={familyForm.errors.phone} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 py-2">
                            <Checkbox
                                id="fam_is_dependent"
                                checked={familyForm.data.is_dependent}
                                onCheckedChange={(checked) =>
                                    familyForm.setData('is_dependent', checked === true)
                                }
                            />
                            <Label htmlFor="fam_is_dependent" className="cursor-pointer">Is Dependent (Tanggungan)</Label>
                            <InputError message={familyForm.errors.is_dependent} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fam_notes">Notes</Label>
                            <Textarea
                                id="fam_notes"
                                value={familyForm.data.notes}
                                onChange={(e) => familyForm.setData('notes', e.target.value)}
                                placeholder="Additional details..."
                            />
                            <InputError message={familyForm.errors.notes} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreatingFamily(false);
                                    setEditingFamily(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={familyForm.processing}>
                                Save Family Member
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Family Member Deletion Dialog */}
            <Dialog
                open={deletingFamily !== null}
                onOpenChange={(open) => !open && setDeletingFamily(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Family Member</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to remove this family member?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingFamily(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                router.delete(
                                    EmployeeFamilyMemberController.destroy.url(
                                        deletingFamily.id,
                                    ),
                                    { onSuccess: () => setDeletingFamily(null) },
                                )
                            }
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rank History Dialog */}
            <Dialog
                open={isCreatingRank || editingRankHist !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreatingRank(false);
                        setEditingRankHist(null);
                        rankHistForm.reset();
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingRankHist ? 'Edit Rank Record' : 'Add Rank Record'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitRankHist} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rank_id">Rank</Label>
                            <Select
                                value={rankHistForm.data.employee_rank_id}
                                onValueChange={(v) => rankHistForm.setData('employee_rank_id', v)}
                            >
                                <SelectTrigger id="rank_id">
                                    <SelectValue placeholder="Select rank" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(ranks || []).map((r) => (
                                        <SelectItem key={r.id} value={r.id}>
                                            {r.name} ({r.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={rankHistForm.errors.employee_rank_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="rank_start_date">Start Date</Label>
                                <Input
                                    id="rank_start_date"
                                    type="date"
                                    value={rankHistForm.data.start_date}
                                    onChange={(e) =>
                                        rankHistForm.setData('start_date', e.target.value)
                                    }
                                />
                                <InputError message={rankHistForm.errors.start_date} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rank_end_date">End Date (Optional)</Label>
                                <Input
                                    id="rank_end_date"
                                    type="date"
                                    value={rankHistForm.data.end_date}
                                    onChange={(e) =>
                                        rankHistForm.setData('end_date', e.target.value)
                                    }
                                />
                                <InputError message={rankHistForm.errors.end_date} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rank_effective_date">Effective Date</Label>
                            <Input
                                id="rank_effective_date"
                                type="date"
                                value={rankHistForm.data.effective_date}
                                onChange={(e) =>
                                    rankHistForm.setData('effective_date', e.target.value)
                                }
                            />
                            <InputError message={rankHistForm.errors.effective_date} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="rank_dec_num">Decree Number</Label>
                                <Input
                                    id="rank_dec_num"
                                    value={rankHistForm.data.decree_number}
                                    onChange={(e) =>
                                        rankHistForm.setData('decree_number', e.target.value)
                                    }
                                    placeholder="e.g. 89/SK/2026"
                                />
                                <InputError message={rankHistForm.errors.decree_number} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rank_dec_date">Decree Date</Label>
                                <Input
                                    id="rank_dec_date"
                                    type="date"
                                    value={rankHistForm.data.decree_date}
                                    onChange={(e) =>
                                        rankHistForm.setData('decree_date', e.target.value)
                                    }
                                />
                                <InputError message={rankHistForm.errors.decree_date} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rank_dec_file">Decree File (PDF/JPG/PNG)</Label>
                            <Input
                                id="rank_dec_file"
                                type="file"
                                onChange={(e) =>
                                    rankHistForm.setData(
                                        'decree_file',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            <InputError message={rankHistForm.errors.decree_file} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rank_remarks">Remarks</Label>
                            <Textarea
                                id="rank_remarks"
                                value={rankHistForm.data.remarks}
                                onChange={(e) => rankHistForm.setData('remarks', e.target.value)}
                                placeholder="Additional remarks..."
                            />
                            <InputError message={rankHistForm.errors.remarks} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreatingRank(false);
                                    setEditingRankHist(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={rankHistForm.processing}>
                                Save Record
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Rank History Deletion Dialog */}
            <Dialog
                open={deletingRankHist !== null}
                onOpenChange={(open) => !open && setDeletingRankHist(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Rank Record</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        Are you sure you want to remove this rank history record?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingRankHist(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                router.delete(
                                    EmployeeRankHistoryController.destroy.url(
                                        deletingRankHist.id,
                                    ),
                                    { onSuccess: () => setDeletingRankHist(null) },
                                )
                            }
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EmployeeShow.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Employees', href: employeesIndex() },
        { title: 'Detail', href: '' },
    ],
};
