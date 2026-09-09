import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Calendar,
    Eye,
    GraduationCap,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserCheck,
    X,
} from 'lucide-react';
import { useState } from 'react';
import StudentController from '@/actions/App/Http/Controllers/Hr/StudentController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    index as studentsIndex,
    show as studentShow,
    create as studentCreate,
    edit as studentEdit,
} from '@/routes/students';
import type { Auth } from '@/types';

type Student = {
    id: string;
    name: string;
    reg_no: string;
    email: string;
    year: number;
    status: string;
    department?: { name: string };
    created_at: string;
};

type PageProps = {
    auth: Auth;
    students: Student[];
    filters: {
        search?: string;
    };
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function StudentsIndex({ students, filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingStudent, setDeletingStudent] = useState<Student | null>(
        null,
    );
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredStudents = students.filter((st) => {
        const matchesSearch =
            st.name.toLowerCase().includes(search.toLowerCase()) ||
            st.email.toLowerCase().includes(search.toLowerCase()) ||
            st.reg_no.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || st.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const mayCreate = can(auth, 'students.manage');
    const mayUpdate = can(auth, 'students.manage');
    const mayDelete = can(auth, 'students.manage');

    function destroyStudent(): void {
        if (!deletingStudent) {
return;
}

        router.delete(StudentController.destroy.url(deletingStudent.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingStudent(null),
        });
    }

    const totalActive = students.filter((s) => s.status === 'active').length;
    const totalGraduated = students.filter((s) => s.status === 'graduated').length;
    const totalOnLeave = students.filter((s) => s.status === 'on_leave').length;

    return (
        <>
            <Head title="Students" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Students
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage student database and academic profiles
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {mayCreate && (
                            <Link href={studentCreate()}>
                                <Button className="cursor-pointer gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Student
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Students
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {students.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Active
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalActive}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/35 dark:text-blue-400">
                                <BadgeCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Graduated
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalGraduated}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/35 dark:text-amber-400">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    On Leave
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalOnLeave}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search students..."
                            className="bg-white pl-9 dark:bg-zinc-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex w-full flex-wrap gap-3 md:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="graduated">Graduated</option>
                            <option value="withdrawn">Withdrawn</option>
                            <option value="on_leave">On Leave</option>
                        </select>

                        <span className="inline-flex h-10 items-center rounded-full border border-input bg-white px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground dark:border-zinc-800 dark:bg-zinc-900">
                            {filteredStudents.length} records
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Reg #</th>
                                    <th className="px-6 py-4">Name / Email</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Year</th>
                                    <th className="px-6 py-4 text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((st) => (
                                        <tr
                                            key={st.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <code className="font-mono text-xs text-muted-foreground">
                                                    {st.reg_no}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {st.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {st.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {st.department?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                    {st.year}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide capitalize ${
                                                        st.status === 'active'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : st.status ===
                                                                'graduated'
                                                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400'
                                                              : st.status ===
                                                                  'on_leave'
                                                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400'
                                                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    {st.status === 'active' && (
                                                        <BadgeCheck className="h-3 w-3" />
                                                    )}
                                                    {st.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={studentShow.url(
                                                            st.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer"
                                                            title="View"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayUpdate && (
                                                        <Link
                                                            href={studentEdit.url(
                                                                st.id,
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {mayDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                            title="Delete"
                                                            onClick={() =>
                                                                setDeletingStudent(
                                                                    st,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog
                open={deletingStudent !== null}
                onOpenChange={(open) => !open && setDeletingStudent(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Student</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic text-muted-foreground">
                        This will permanently remove student record and login
                        account for {deletingStudent?.name}. Are you sure?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingStudent(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyStudent}
                        >
                            Delete permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [{ title: 'Students', href: studentsIndex() }],
};
