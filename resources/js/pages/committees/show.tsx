import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    DollarSign,
    FileText,
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    Calendar,
    Clipboard,
    Download,
    Upload,
    Info,
    TrendingUp,
    AlertTriangle,
    ChevronRight,
    UserPlus,
    Eye,
    ListTodo,
    Folder,
    BadgeAlert,
    Coins,
    PlusCircle,
    CheckCircle2,
    AlertCircle,
    Clock,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __, intlLocale } from '@/lib/i18n';
import {
    store as committeeBudgetItemStore,
    destroy as committeeBudgetItemDestroy,
} from '@/routes/committee-budget-items';
import {
    store as committeeBudgetStore,
    destroy as committeeBudgetDestroy,
} from '@/routes/committee-budgets';
import {
    store as committeeDocumentStore,
    destroy as committeeDocumentDestroy,
} from '@/routes/committee-documents';
import {
    store as committeeExpenseItemStore,
    destroy as committeeExpenseItemDestroy,
} from '@/routes/committee-expense-items';
import {
    store as committeeExpenseStore,
    destroy as committeeExpenseDestroy,
} from '@/routes/committee-expenses';
import {
    store as committeeMemberStore,
    destroy as committeeMemberDestroy,
} from '@/routes/committee-members';
import { store as committeeTaskProgressStore } from '@/routes/committee-task-progresses';
import {
    store as committeeTaskStore,
    destroy as committeeTaskDestroy,
} from '@/routes/committee-tasks';
import { index as committeesIndex } from '@/routes/committees';
import type { Auth } from '@/types';

type User = {
    id: string;
    name: string;
};

type Employee = {
    id: string;
    name: string;
};

type Organization = {
    id: string;
    name: string;
};

type CommitteeMember = {
    id: string;
    role: string;
    is_leader: boolean;
    user?: User;
    supervisor?: CommitteeMember;
};

type CommitteeTaskProgress = {
    id: string;
    progress_date: string;
    progress_percentage: number;
    description: string;
    createdBy?: Employee;
};

type CommitteeTask = {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    completion_percentage: number;
    start_date?: string;
    due_date?: string;
    assignedTo?: CommitteeMember;
    committeeTaskProgresses?: CommitteeTaskProgress[];
};

type CommitteeBudgetItem = {
    id: string;
    category: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    notes?: string;
};

type CommitteeBudget = {
    id: string;
    budget_number: string;
    title: string;
    prepared_at: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    preparedBy?: Employee;
    approvedBy?: Employee;
    committeeBudgetItems?: CommitteeBudgetItem[];
};

type CommitteeExpenseItem = {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    receipt_number?: string;
    receipt_file?: string;
    committeeBudgetItem?: CommitteeBudgetItem;
};

type CommitteeExpense = {
    id: string;
    expense_number: string;
    expense_date: string;
    description: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    submittedBy?: Employee;
    approvedBy?: Employee;
    committeeExpenseItems?: CommitteeExpenseItem[];
};

type CommitteeDocument = {
    id: string;
    title: string;
    document_type:
        | 'proposal'
        | 'tor'
        | 'budget'
        | 'report'
        | 'photo'
        | 'certificate'
        | 'other';
    file_path: string;
    uploaded_at: string;
    uploadedBy?: Employee;
};

type CommitteeProgress = {
    id: string;
    progress_date: string;
    progress_percentage: number;
    summary: string;
    issues?: string;
    risks?: string;
    next_plan?: string;
    reportedBy?: Employee;
};

type Committee = {
    id: string;
    code: string;
    name: string;
    objective: string;
    expected_outcome: string;
    start_date: string;
    end_date: string;
    status: 'draft' | 'active' | 'inactive' | 'completed';
    description: string;
    chairman?: Employee;
    organization?: Organization;
    committeeMembers?: CommitteeMember[];
    committeeTasks?: CommitteeTask[];
    committeeBudgets?: CommitteeBudget[];
    committeeExpenses?: CommitteeExpense[];
    committeeDocuments?: CommitteeDocument[];
    committeeProgresses?: CommitteeProgress[];
};

type PageProps = {
    auth: Auth;
    committee: Committee;
    employees: Employee[];
    organizations: Organization[];
};

const statusLabels: Record<string, string> = {
    draft: __('Draft'),
    active: __('Active'),
    inactive: __('Inactive'),
    completed: __('Completed'),
    open: __('Open'),
    in_progress: __('In progress'),
    cancelled: __('Cancelled'),
    submitted: __('Submitted'),
    approved: __('Approved'),
    rejected: __('Rejected'),
};

const priorityLabels: Record<string, string> = {
    low: __('Low'),
    medium: __('Medium'),
    high: __('High'),
};

const tabLabels: Record<string, string> = {
    overview: __('Overview'),
    members: __('Members'),
    tasks: __('Tasks'),
    budget: __('Budget'),
    documents: __('Documents'),
};

const documentTypeLabels: Record<string, string> = {
    proposal: __('Proposal'),
    tor: __('TOR (Terms of Reference)'),
    budget: __('Budget Sheet'),
    report: __('Activity Report'),
    photo: __('Photo Documentation'),
    certificate: __('Certificate'),
    other: __('Other'),
};

export default function CommitteeShow({
    committee,
    employees = [],
    organizations = [],
}: PageProps) {
    const [activeTab, setActiveTab] = useState<
        'overview' | 'members' | 'tasks' | 'budget' | 'documents'
    >('overview');

    // Dialog state
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isAddTaskProgressOpen, setIsAddTaskProgressOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<CommitteeTask | null>(
        null,
    );
    const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
    const [isAddBudgetItemOpen, setIsAddBudgetItemOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] =
        useState<CommitteeBudget | null>(null);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isAddExpenseItemOpen, setIsAddExpenseItemOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] =
        useState<CommitteeExpense | null>(null);
    const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);

    // Form handlers
    const memberForm = useForm({
        committee_id: committee.id,
        user_id: '',
        role: '',
        is_leader: false,
        supervisor_id_id: '0', // sqlite default
    });

    const taskForm = useForm({
        committee_id: committee.id,
        title: '',
        description: '',
        priority: 'medium',
        status: 'open',
        completion_percentage: 0,
        assigned_to_id: '0',
        parent_id_id: '0',
    });

    const taskProgressForm = useForm({
        committee_task_id: '',
        progress_date: new Date().toISOString().slice(0, 16),
        progress_percentage: 0,
        description: '',
        attachment: '',
        created_by_id: employees[0]?.id || '0',
        created_by: employees[0]?.name || 'System',
    });

    const budgetForm = useForm({
        committee_id: committee.id,
        budget_number: '',
        title: '',
        prepared_at: new Date().toISOString().slice(0, 10),
        status: 'draft',
        prepared_by_id: employees[0]?.id || '0',
        approved_by_id: employees[0]?.id || '0',
    });

    const budgetItemForm = useForm({
        committee_budget_id: '',
        category: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        total_amount: 0,
        notes: '',
    });

    const expenseForm = useForm({
        committee_id: committee.id,
        expense_number: '',
        expense_date: new Date().toISOString().slice(0, 10),
        description: '',
        status: 'draft',
        submitted_by_id: employees[0]?.id || '0',
        approved_by_id: employees[0]?.id || '0',
    });

    const expenseItemForm = useForm({
        committee_expense_id: '',
        committee_budget_item_id: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        total_amount: 0,
        receipt_number: '',
        receipt_file: '',
    });

    const documentForm = useForm({
        committee_id: committee.id,
        title: '',
        document_type: 'proposal',
        file_path: '',
        uploaded_by: employees[0]?.name || 'System',
        uploaded_at: new Date().toISOString().slice(0, 16),
        uploaded_by_id: employees[0]?.id || '0',
    });

    // Submissions
    const submitMember = (e: FormEvent) => {
        e.preventDefault();
        memberForm.post(committeeMemberStore.url(), {
            onSuccess: () => {
                setIsAddMemberOpen(false);
                memberForm.reset();
            },
        });
    };

    const submitTask = (e: FormEvent) => {
        e.preventDefault();
        taskForm.post(committeeTaskStore.url(), {
            onSuccess: () => {
                setIsAddTaskOpen(false);
                taskForm.reset();
            },
        });
    };

    const submitTaskProgress = (e: FormEvent) => {
        e.preventDefault();
        taskProgressForm.post(committeeTaskProgressStore.url(), {
            onSuccess: () => {
                setIsAddTaskProgressOpen(false);
                taskProgressForm.reset();
            },
        });
    };

    const submitBudget = (e: FormEvent) => {
        e.preventDefault();
        budgetForm.post(committeeBudgetStore.url(), {
            onSuccess: () => {
                setIsAddBudgetOpen(false);
                budgetForm.reset();
            },
        });
    };

    const submitBudgetItem = (e: FormEvent) => {
        e.preventDefault();
        budgetItemForm.post(committeeBudgetItemStore.url(), {
            onSuccess: () => {
                setIsAddBudgetItemOpen(false);
                budgetItemForm.reset();
            },
        });
    };

    const submitExpense = (e: FormEvent) => {
        e.preventDefault();
        expenseForm.post(committeeExpenseStore.url(), {
            onSuccess: () => {
                setIsAddExpenseOpen(false);
                expenseForm.reset();
            },
        });
    };

    const submitExpenseItem = (e: FormEvent) => {
        e.preventDefault();
        expenseItemForm.post(committeeExpenseItemStore.url(), {
            onSuccess: () => {
                setIsAddExpenseItemOpen(false);
                expenseItemForm.reset();
            },
        });
    };

    const submitDocument = (e: FormEvent) => {
        e.preventDefault();
        documentForm.post(committeeDocumentStore.url(), {
            onSuccess: () => {
                setIsAddDocumentOpen(false);
                documentForm.reset();
            },
        });
    };

    const deleteItem = (routePath: string) => {
        if (confirm(__('Are you sure you want to delete this?'))) {
            router.delete(routePath);
        }
    };

    // Computes totals
    const totalBudget = useMemo(() => {
        return (committee.committeeBudgets || []).reduce((sum, b) => {
            const itemSum = (b.committeeBudgetItems || []).reduce(
                (s, i) => s + Number(i.total_amount),
                0,
            );

            return sum + itemSum;
        }, 0);
    }, [committee.committeeBudgets]);

    const totalExpense = useMemo(() => {
        return (committee.committeeExpenses || []).reduce((sum, e) => {
            const itemSum = (e.committeeExpenseItems || []).reduce(
                (s, i) => s + Number(i.total_amount),
                0,
            );

            return sum + itemSum;
        }, 0);
    }, [committee.committeeExpenses]);

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Committee Cockpit - :name', {
                    name: committee.name,
                })}
            />

            {/* Header info */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-indigo-950 via-slate-900 to-zinc-950 p-6 text-white shadow-md">
                <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md border border-violet-800 bg-violet-950/80 px-2.5 py-1 text-xs font-bold tracking-wider text-violet-400 uppercase">
                                {committee.code}
                            </span>
                            <span className="rounded-md border border-emerald-800 bg-emerald-950/80 px-2.5 py-1 text-xs font-bold text-emerald-400 capitalize">
                                {statusLabels[committee.status] ??
                                    committee.status}
                            </span>
                        </div>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            {committee.name}
                        </h1>
                        {committee.organization && (
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                                <Shield className="h-4 w-4 text-violet-400" />{' '}
                                {committee.organization.name}
                            </p>
                        )}
                    </div>
                    <Link
                        href={committeesIndex.url()}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700"
                    >
                        {__('Back to List')}
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-5 md:grid-cols-3">
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                            {__('Objective')}
                        </p>
                        <p className="mt-1 line-clamp-3 text-sm italic">
                            "
                            {committee.objective ||
                                __('No objective specified.')}
                            "
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                            {__('Expected Outcome')}
                        </p>
                        <p className="mt-1 line-clamp-3 text-sm italic">
                            "
                            {committee.expected_outcome ||
                                __('No expected outcomes specified.')}
                            "
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800/60 bg-slate-950/50 p-4">
                        <div>
                            <p className="text-xs text-slate-400">
                                {__('Timeline')}
                            </p>
                            <p className="mt-1 text-xs font-bold text-violet-300">
                                {__(':start to :end', {
                                    start: committee.start_date || '-',
                                    end: committee.end_date || '-',
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">
                                {__('Chairman')}
                            </p>
                            <p className="mt-1 text-xs font-bold text-violet-300">
                                {committee.chairman?.name || __('Unassigned')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick KPI Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            {__('Members')}
                        </p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                            {(committee.committeeMembers || []).length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <CheckSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            {__('Tasks Progress')}
                        </p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                            {(() => {
                                const tasks = committee.committeeTasks || [];

                                if (tasks.length === 0) {
                                    return '0%';
                                }

                                const total = tasks.reduce(
                                    (sum, t) =>
                                        sum + Number(t.completion_percentage),
                                    0,
                                );

                                return `${Math.round(total / tasks.length)}%`;
                            })()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <Coins className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            {__('Total Budget')}
                        </p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                            ${totalBudget.toLocaleString(intlLocale())}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="rounded-xl bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            {__('Total Expenses')}
                        </p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                            ${totalExpense.toLocaleString(intlLocale())}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 overflow-x-auto rounded-xl border-b bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
                {(
                    [
                        'overview',
                        'members',
                        'tasks',
                        'budget',
                        'documents',
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold capitalize transition-all duration-200 ${
                            activeTab === tab
                                ? 'border border-zinc-200/50 bg-white text-violet-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-violet-400'
                                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                    >
                        {tab === 'overview' && (
                            <LayoutDashboard className="h-4 w-4" />
                        )}
                        {tab === 'members' && <Users className="h-4 w-4" />}
                        {tab === 'tasks' && <CheckSquare className="h-4 w-4" />}
                        {tab === 'budget' && <DollarSign className="h-4 w-4" />}
                        {tab === 'documents' && (
                            <FileText className="h-4 w-4" />
                        )}
                        {tabLabels[tab] ?? tab}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                <Info className="h-5 w-5 text-violet-600" />{' '}
                                {__('General Information')}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {__(
                                    'Detailed scope and description of this committee.',
                                )}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800/80 dark:bg-zinc-950">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                {committee.description ||
                                    __('No detailed description available.')}
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. MEMBERS TAB */}
                {activeTab === 'members' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                    <Users className="h-5 w-5 text-violet-600" />{' '}
                                    {__('Committee Members')}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {__(
                                        'Manage institutional and external committee members.',
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsAddMemberOpen(true)}
                                className="bg-violet-600 text-white shadow-xs hover:bg-violet-700"
                            >
                                <UserPlus className="mr-2 h-4 w-4" />{' '}
                                {__('Add Member')}
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-2xl border dark:border-zinc-800">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-950">
                                        <th className="px-6 py-4">
                                            {__('Name')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {__('Role')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {__('Leader status')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {__('Supervisor')}
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            {__('Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm dark:divide-zinc-800">
                                    {(committee.committeeMembers || [])
                                        .length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-zinc-400 italic"
                                            >
                                                {__('No members assigned yet.')}
                                            </td>
                                        </tr>
                                    ) : (
                                        (committee.committeeMembers || []).map(
                                            (m) => (
                                                <tr
                                                    key={m.id}
                                                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/50"
                                                >
                                                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                                        {m.user?.name ||
                                                            __('External')}
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                                        {m.role}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {m.is_leader ? (
                                                            <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                                                                {__('Leader')}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                                {__('Member')}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-500">
                                                        {m.supervisor?.user
                                                            ?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                deleteItem(
                                                                    committeeMemberDestroy.url(
                                                                        m.id,
                                                                    ),
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. TASKS TAB */}
                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                    <ListTodo className="h-5 w-5 text-violet-600" />{' '}
                                    {__('Tasks & Progress')}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {__(
                                        'Assign tasks to members and monitor progress percentage.',
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsAddTaskOpen(true)}
                                className="bg-violet-600 text-white shadow-xs hover:bg-violet-700"
                            >
                                <Plus className="mr-2 h-4 w-4" />{' '}
                                {__('Add Task')}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {(committee.committeeTasks || []).length === 0 ? (
                                <div className="rounded-2xl border border-dashed p-12 text-center text-zinc-400 italic dark:border-zinc-800">
                                    {__('No tasks created yet.')}
                                </div>
                            ) : (
                                (committee.committeeTasks || []).map((t) => (
                                    <div
                                        key={t.id}
                                        className="rounded-2xl border p-5 shadow-xs transition-colors hover:border-violet-300 dark:border-zinc-800 dark:hover:border-violet-800"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-zinc-900 dark:text-white">
                                                    {t.title}
                                                </h3>
                                                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>
                                                        {__('Priority:')}{' '}
                                                        <span className="font-semibold text-amber-600 capitalize">
                                                            {priorityLabels[
                                                                t.priority
                                                            ] ?? t.priority}
                                                        </span>
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {__('Status:')}{' '}
                                                        <span className="font-semibold text-violet-600 capitalize">
                                                            {statusLabels[
                                                                t.status
                                                            ] ??
                                                                t.status.replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                        </span>
                                                    </span>
                                                    {t.assignedTo?.user && (
                                                        <>
                                                            <span>•</span>
                                                            <span>
                                                                {__(
                                                                    'Assigned:',
                                                                )}{' '}
                                                                <span className="font-semibold">
                                                                    {
                                                                        t
                                                                            .assignedTo
                                                                            .user
                                                                            .name
                                                                    }
                                                                </span>
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => {
                                                        setSelectedTask(t);
                                                        taskProgressForm.setData(
                                                            'committee_task_id',
                                                            t.id,
                                                        );
                                                        setIsAddTaskProgressOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="border-zinc-200 px-2.5 py-1 text-xs dark:border-zinc-800"
                                                >
                                                    <TrendingUp className="mr-1 h-3.5 w-3.5" />{' '}
                                                    {__('Log Progress')}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        deleteItem(
                                                            committeeTaskDestroy.url(
                                                                t.id,
                                                            ),
                                                        )
                                                    }
                                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-sm whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                                            {t.description}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="mt-4 space-y-1">
                                            <div className="flex justify-between text-xs font-semibold text-zinc-500">
                                                <span>
                                                    {__('Completion Progress')}
                                                </span>
                                                <span>
                                                    {t.completion_percentage}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                <div
                                                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-300"
                                                    style={{
                                                        width: `${t.completion_percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Progress Logs */}
                                        {t.committeeTaskProgresses &&
                                            t.committeeTaskProgresses.length >
                                                0 && (
                                                <div className="mt-4 space-y-3 border-t pt-4 dark:border-zinc-800/80">
                                                    <p className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                                                        {__('Progress Log')}
                                                    </p>
                                                    {t.committeeTaskProgresses.map(
                                                        (p) => (
                                                            <div
                                                                key={p.id}
                                                                className="space-y-1 rounded-lg border bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-950"
                                                            >
                                                                <div className="flex justify-between text-zinc-500">
                                                                    <span>
                                                                        {__(
                                                                            'By:',
                                                                        )}{' '}
                                                                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                                                            {p
                                                                                .createdBy
                                                                                ?.name ||
                                                                                __(
                                                                                    'System',
                                                                                )}
                                                                        </span>
                                                                    </span>
                                                                    <span>
                                                                        {new Date(
                                                                            p.progress_date,
                                                                        ).toLocaleDateString(
                                                                            intlLocale(),
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                                    {__(
                                                                        'Progress: :percent%',
                                                                        {
                                                                            percent:
                                                                                p.progress_percentage,
                                                                        },
                                                                    )}
                                                                </p>
                                                                <p className="text-zinc-600 italic dark:text-zinc-400">
                                                                    "
                                                                    {
                                                                        p.description
                                                                    }
                                                                    "
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* 4. BUDGETS & EXPENSES TAB */}
                {activeTab === 'budget' && (
                    <div className="space-y-10">
                        {/* Budgets Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                        <Coins className="h-5 w-5 text-violet-600" />{' '}
                                        {__('Committee Budgets')}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {__(
                                            'Manage budget plans, approval statuses, and budget allocations.',
                                        )}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsAddBudgetOpen(true)}
                                    className="bg-violet-600 text-white shadow-xs hover:bg-violet-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />{' '}
                                    {__('Add Budget Plan')}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {(committee.committeeBudgets || []).length ===
                                0 ? (
                                    <div className="rounded-2xl border border-dashed p-12 text-center text-zinc-400 italic dark:border-zinc-800">
                                        {__('No budget plans declared yet.')}
                                    </div>
                                ) : (
                                    (committee.committeeBudgets || []).map(
                                        (b) => (
                                            <div
                                                key={b.id}
                                                className="rounded-2xl border bg-zinc-50/20 p-5 shadow-xs dark:border-zinc-800"
                                            >
                                                <div className="flex items-start justify-between border-b pb-3 dark:border-zinc-800">
                                                    <div>
                                                        <span className="mr-2 rounded-sm bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-600 uppercase dark:bg-violet-950/40 dark:text-violet-400">
                                                            {b.budget_number}
                                                        </span>
                                                        <span className="mr-2 text-xs font-bold text-zinc-500 capitalize">
                                                            {statusLabels[
                                                                b.status
                                                            ] ?? b.status}
                                                        </span>
                                                        <h3 className="mt-1 font-bold text-zinc-900 dark:text-white">
                                                            {b.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="xs"
                                                            onClick={() => {
                                                                setSelectedBudget(
                                                                    b,
                                                                );
                                                                budgetItemForm.setData(
                                                                    'committee_budget_id',
                                                                    b.id,
                                                                );
                                                                setIsAddBudgetItemOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className="border-zinc-200 text-xs dark:border-zinc-800"
                                                        >
                                                            <PlusCircle className="mr-1 h-3.5 w-3.5" />{' '}
                                                            {__('Add Item')}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                deleteItem(
                                                                    committeeBudgetDestroy.url(
                                                                        b.id,
                                                                    ),
                                                                )
                                                            }
                                                            className="h-8 w-8 text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Items table */}
                                                <div className="mt-4 overflow-x-auto">
                                                    <table className="w-full border-collapse text-left text-xs">
                                                        <thead>
                                                            <tr className="border-b font-semibold text-zinc-500 uppercase dark:border-zinc-800">
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Category',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Description',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Quantity',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Unit Price',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Total',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2 text-right">
                                                                    {__(
                                                                        'Actions',
                                                                    )}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300">
                                                            {(
                                                                b.committeeBudgetItems ||
                                                                []
                                                            ).length === 0 ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan={
                                                                            6
                                                                        }
                                                                        className="py-4 text-center text-zinc-400 italic"
                                                                    >
                                                                        {__(
                                                                            'No budget items defined yet.',
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                (
                                                                    b.committeeBudgetItems ||
                                                                    []
                                                                ).map((bi) => (
                                                                    <tr
                                                                        key={
                                                                            bi.id
                                                                        }
                                                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20"
                                                                    >
                                                                        <td className="py-3 font-semibold text-zinc-900 capitalize dark:text-white">
                                                                            {
                                                                                bi.category
                                                                            }
                                                                        </td>
                                                                        <td className="py-3">
                                                                            {
                                                                                bi.description
                                                                            }
                                                                        </td>
                                                                        <td className="py-3">
                                                                            {
                                                                                bi.quantity
                                                                            }
                                                                        </td>
                                                                        <td className="py-3">
                                                                            $
                                                                            {Number(
                                                                                bi.unit_price,
                                                                            ).toLocaleString(
                                                                                intlLocale(),
                                                                            )}
                                                                        </td>
                                                                        <td className="py-3 font-bold text-violet-600 dark:text-violet-400">
                                                                            $
                                                                            {Number(
                                                                                bi.total_amount,
                                                                            ).toLocaleString(
                                                                                intlLocale(),
                                                                            )}
                                                                        </td>
                                                                        <td className="py-3 text-right">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() =>
                                                                                    deleteItem(
                                                                                        committeeBudgetItemDestroy.url(
                                                                                            bi.id,
                                                                                        ),
                                                                                    )
                                                                                }
                                                                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                                                            >
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ),
                                    )
                                )}
                            </div>
                        </div>

                        {/* Expenses Section */}
                        <div className="space-y-6 border-t pt-6 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                        <DollarSign className="h-5 w-5 text-rose-600" />{' '}
                                        {__('Committee Expenses')}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {__(
                                            'Record claims, invoices, and expense items against the budget.',
                                        )}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsAddExpenseOpen(true)}
                                    className="bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />{' '}
                                    {__('Record Expense')}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {(committee.committeeExpenses || []).length ===
                                0 ? (
                                    <div className="rounded-2xl border border-dashed p-12 text-center text-zinc-400 italic dark:border-zinc-800">
                                        {__('No expenses recorded yet.')}
                                    </div>
                                ) : (
                                    (committee.committeeExpenses || []).map(
                                        (ex) => (
                                            <div
                                                key={ex.id}
                                                className="rounded-2xl border bg-rose-50/5 p-5 shadow-xs dark:border-zinc-800 dark:bg-rose-950/5"
                                            >
                                                <div className="flex items-start justify-between border-b pb-3 dark:border-zinc-800">
                                                    <div>
                                                        <span className="mr-2 rounded-sm bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 uppercase dark:bg-rose-950/40 dark:text-rose-400">
                                                            {ex.expense_number}
                                                        </span>
                                                        <span className="mr-2 text-xs font-bold text-zinc-500 capitalize">
                                                            {statusLabels[
                                                                ex.status
                                                            ] ?? ex.status}
                                                        </span>
                                                        <span className="text-xs text-zinc-400">
                                                            {ex.expense_date}
                                                        </span>
                                                        <h3 className="mt-1 font-bold text-zinc-900 dark:text-white">
                                                            {ex.description}
                                                        </h3>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="xs"
                                                            onClick={() => {
                                                                setSelectedExpense(
                                                                    ex,
                                                                );
                                                                expenseItemForm.setData(
                                                                    'committee_expense_id',
                                                                    ex.id,
                                                                );
                                                                setIsAddExpenseItemOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className="border-zinc-200 text-xs dark:border-zinc-800"
                                                        >
                                                            <PlusCircle className="mr-1 h-3.5 w-3.5" />{' '}
                                                            {__(
                                                                'Add Expense Item',
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                deleteItem(
                                                                    committeeExpenseDestroy.url(
                                                                        ex.id,
                                                                    ),
                                                                )
                                                            }
                                                            className="h-8 w-8 text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Expense Items table */}
                                                <div className="mt-4 overflow-x-auto">
                                                    <table className="w-full border-collapse text-left text-xs">
                                                        <thead>
                                                            <tr className="border-b font-semibold text-zinc-500 uppercase dark:border-zinc-800">
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Description',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Allocated Budget Item',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Quantity',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Unit Price',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Total Spent',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2">
                                                                    {__(
                                                                        'Receipt',
                                                                    )}
                                                                </th>
                                                                <th className="pb-2 text-right">
                                                                    {__(
                                                                        'Actions',
                                                                    )}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300">
                                                            {(
                                                                ex.committeeExpenseItems ||
                                                                []
                                                            ).length === 0 ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan={
                                                                            7
                                                                        }
                                                                        className="py-4 text-center text-zinc-400 italic"
                                                                    >
                                                                        {__(
                                                                            'No items linked to this expense claim yet.',
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                (
                                                                    ex.committeeExpenseItems ||
                                                                    []
                                                                ).map((ei) => (
                                                                    <tr
                                                                        key={
                                                                            ei.id
                                                                        }
                                                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20"
                                                                    >
                                                                        <td className="py-3 font-semibold text-zinc-900 dark:text-white">
                                                                            {
                                                                                ei.description
                                                                            }
                                                                        </td>
                                                                        <td className="py-3 text-zinc-500">
                                                                            {ei
                                                                                .committeeBudgetItem
                                                                                ?.description ||
                                                                                __(
                                                                                    'None',
                                                                                )}
                                                                        </td>
                                                                        <td className="py-3">
                                                                            {
                                                                                ei.quantity
                                                                            }
                                                                        </td>
                                                                        <td className="py-3">
                                                                            $
                                                                            {Number(
                                                                                ei.unit_price,
                                                                            ).toLocaleString(
                                                                                intlLocale(),
                                                                            )}
                                                                        </td>
                                                                        <td className="py-3 font-bold text-rose-600 dark:text-rose-400">
                                                                            $
                                                                            {Number(
                                                                                ei.total_amount,
                                                                            ).toLocaleString(
                                                                                intlLocale(),
                                                                            )}
                                                                        </td>
                                                                        <td className="py-3">
                                                                            {ei.receipt_number ||
                                                                                '-'}
                                                                        </td>
                                                                        <td className="py-3 text-right">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() =>
                                                                                    deleteItem(
                                                                                        committeeExpenseItemDestroy.url(
                                                                                            ei.id,
                                                                                        ),
                                                                                    )
                                                                                }
                                                                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                                                            >
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ),
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                    <Folder className="h-5 w-5 text-violet-600" />{' '}
                                    {__('Committee Documents')}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {__(
                                        'Upload and access official committee documents, proposals, and reports.',
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsAddDocumentOpen(true)}
                                className="bg-violet-600 text-white shadow-xs hover:bg-violet-700"
                            >
                                <Upload className="mr-2 h-4 w-4" />{' '}
                                {__('Upload Document')}
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-2xl border dark:border-zinc-800">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-950">
                                        <th className="px-6 py-4">
                                            {__('Title')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {__('Type')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {__('Uploaded At')}
                                        </th>
                                        <th className="px-6 py-4">
                                            {__('Uploaded By')}
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            {__('Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm dark:divide-zinc-800">
                                    {(committee.committeeDocuments || [])
                                        .length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-zinc-400 italic"
                                            >
                                                {__(
                                                    'No documents uploaded yet.',
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        (
                                            committee.committeeDocuments || []
                                        ).map((doc) => (
                                            <tr
                                                key={doc.id}
                                                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/50"
                                            >
                                                <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                                                    {doc.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                                                        {documentTypeLabels[
                                                            doc.document_type
                                                        ] ?? doc.document_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500">
                                                    {new Date(
                                                        doc.uploaded_at,
                                                    ).toLocaleDateString(
                                                        intlLocale(),
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                                    {doc.uploadedBy?.name ||
                                                        __('System')}
                                                </td>
                                                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                    <a
                                                        href={doc.file_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center p-2 text-violet-600 hover:text-violet-800"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            deleteItem(
                                                                committeeDocumentDestroy.url(
                                                                    doc.id,
                                                                ),
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}

            {/* 1. Add Member Modal */}
            <Dialog
                open={isAddMemberOpen}
                onOpenChange={(open) => !open && setIsAddMemberOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Add Committee Member')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitMember} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="member-user">{__('User *')}</Label>
                            <select
                                id="member-user"
                                value={memberForm.data.user_id}
                                onChange={(e) =>
                                    memberForm.setData(
                                        'user_id',
                                        e.target.value,
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                required
                            >
                                <option value="">
                                    {__('Select User/Employee')}
                                </option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                            {memberForm.errors.user_id && (
                                <p className="text-sm text-destructive">
                                    {memberForm.errors.user_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="member-role">{__('Role *')}</Label>
                            <Input
                                id="member-role"
                                value={memberForm.data.role}
                                onChange={(e) =>
                                    memberForm.setData('role', e.target.value)
                                }
                                placeholder={__(
                                    'e.g. Secretary, Technical Expert',
                                )}
                                required
                            />
                            {memberForm.errors.role && (
                                <p className="text-sm text-destructive">
                                    {memberForm.errors.role}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="member-leader"
                                checked={memberForm.data.is_leader}
                                onChange={(e) =>
                                    memberForm.setData(
                                        'is_leader',
                                        e.target.checked,
                                    )
                                }
                                className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                            />
                            <Label htmlFor="member-leader">
                                {__('Assign as Leader/Co-chairman')}
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddMemberOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={memberForm.processing}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                            >
                                {__('Add Member')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 2. Add Task Modal */}
            <Dialog
                open={isAddTaskOpen}
                onOpenChange={(open) => !open && setIsAddTaskOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Add Committee Task')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitTask} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="task-title">{__('Title *')}</Label>
                            <Input
                                id="task-title"
                                value={taskForm.data.title}
                                onChange={(e) =>
                                    taskForm.setData('title', e.target.value)
                                }
                                placeholder={__('Task Title')}
                                required
                            />
                            {taskForm.errors.title && (
                                <p className="text-sm text-destructive">
                                    {taskForm.errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="task-desc">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="task-desc"
                                value={taskForm.data.description}
                                onChange={(e) =>
                                    taskForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder={__(
                                    'Detailed description of task...',
                                )}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="task-priority">
                                    {__('Priority *')}
                                </Label>
                                <select
                                    id="task-priority"
                                    value={taskForm.data.priority}
                                    onChange={(e) =>
                                        taskForm.setData(
                                            'priority',
                                            e.target.value as any,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                >
                                    <option value="low">{__('Low')}</option>
                                    <option value="medium">
                                        {__('Medium')}
                                    </option>
                                    <option value="high">{__('High')}</option>
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="task-assign">
                                    {__('Assign To')}
                                </Label>
                                <select
                                    id="task-assign"
                                    value={taskForm.data.assigned_to_id}
                                    onChange={(e) =>
                                        taskForm.setData(
                                            'assigned_to_id',
                                            e.target.value,
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                >
                                    <option value="0">
                                        {__('Unassigned')}
                                    </option>
                                    {(committee.committeeMembers || []).map(
                                        (m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.user?.name || m.role}
                                            </option>
                                        ),
                                    )}
                                </select>
                                {taskForm.errors.assigned_to_id && (
                                    <p className="text-sm text-destructive">
                                        {taskForm.errors.assigned_to_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddTaskOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={taskForm.processing}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                            >
                                {__('Add Task')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 3. Log Task Progress Modal */}
            <Dialog
                open={isAddTaskProgressOpen}
                onOpenChange={(open) =>
                    !open && setIsAddTaskProgressOpen(false)
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Log Task Progress - :title', {
                                title: selectedTask?.title,
                            })}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitTaskProgress} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="progress-percentage">
                                {__('Completion Percentage (0-100) *')}
                            </Label>
                            <Input
                                id="progress-percentage"
                                type="number"
                                min="0"
                                max="100"
                                value={
                                    taskProgressForm.data.progress_percentage
                                }
                                onChange={(e) =>
                                    taskProgressForm.setData(
                                        'progress_percentage',
                                        Number(e.target.value),
                                    )
                                }
                                required
                            />
                            {taskProgressForm.errors.progress_percentage && (
                                <p className="text-sm text-destructive">
                                    {
                                        taskProgressForm.errors
                                            .progress_percentage
                                    }
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="progress-desc">
                                {__('Description of Progress *')}
                            </Label>
                            <Textarea
                                id="progress-desc"
                                value={taskProgressForm.data.description}
                                onChange={(e) =>
                                    taskProgressForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder={__(
                                    'What updates have been completed?',
                                )}
                                rows={3}
                                required
                            />
                            {taskProgressForm.errors.description && (
                                <p className="text-sm text-destructive">
                                    {taskProgressForm.errors.description}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddTaskProgressOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={taskProgressForm.processing}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                            >
                                {__('Log Progress')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 4. Add Budget Modal */}
            <Dialog
                open={isAddBudgetOpen}
                onOpenChange={(open) => !open && setIsAddBudgetOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Add Budget Plan')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitBudget} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="budget-no">
                                    {__('Budget Number *')}
                                </Label>
                                <Input
                                    id="budget-no"
                                    value={budgetForm.data.budget_number}
                                    onChange={(e) =>
                                        budgetForm.setData(
                                            'budget_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('e.g. BUD-2026-001')}
                                    required
                                />
                                {budgetForm.errors.budget_number && (
                                    <p className="text-sm text-destructive">
                                        {budgetForm.errors.budget_number}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="budget-title">
                                    {__('Title *')}
                                </Label>
                                <Input
                                    id="budget-title"
                                    value={budgetForm.data.title}
                                    onChange={(e) =>
                                        budgetForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('Budget Title')}
                                    required
                                />
                                {budgetForm.errors.title && (
                                    <p className="text-sm text-destructive">
                                        {budgetForm.errors.title}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddBudgetOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={budgetForm.processing}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                            >
                                {__('Save Budget Plan')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 5. Add Budget Item Modal */}
            <Dialog
                open={isAddBudgetItemOpen}
                onOpenChange={(open) => !open && setIsAddBudgetItemOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Add Budget Item to: :title', {
                                title: selectedBudget?.title,
                            })}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitBudgetItem} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="item-cat">
                                    {__('Category *')}
                                </Label>
                                <Input
                                    id="item-cat"
                                    value={budgetItemForm.data.category}
                                    onChange={(e) =>
                                        budgetItemForm.setData(
                                            'category',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'e.g. equipment, refreshment, travel',
                                    )}
                                    required
                                />
                                {budgetItemForm.errors.category && (
                                    <p className="text-sm text-destructive">
                                        {budgetItemForm.errors.category}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="item-desc">
                                    {__('Description *')}
                                </Label>
                                <Input
                                    id="item-desc"
                                    value={budgetItemForm.data.description}
                                    onChange={(e) =>
                                        budgetItemForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'e.g. Purchase of 3 laptops',
                                    )}
                                    required
                                />
                                {budgetItemForm.errors.description && (
                                    <p className="text-sm text-destructive">
                                        {budgetItemForm.errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="item-qty">
                                    {__('Quantity *')}
                                </Label>
                                <Input
                                    id="item-qty"
                                    type="number"
                                    value={budgetItemForm.data.quantity}
                                    onChange={(e) => {
                                        const qty = Number(e.target.value);
                                        budgetItemForm.setData((prev) => ({
                                            ...prev,
                                            quantity: qty,
                                            total_amount: qty * prev.unit_price,
                                        }));
                                    }}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="item-price">
                                    {__('Unit Price *')}
                                </Label>
                                <Input
                                    id="item-price"
                                    type="number"
                                    value={budgetItemForm.data.unit_price}
                                    onChange={(e) => {
                                        const price = Number(e.target.value);
                                        budgetItemForm.setData((prev) => ({
                                            ...prev,
                                            unit_price: price,
                                            total_amount: prev.quantity * price,
                                        }));
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-between rounded-lg border bg-zinc-50 p-3 text-xs font-bold dark:border-zinc-800 dark:bg-zinc-950">
                            <span>{__('Total Item Amount:')}</span>
                            <span className="text-violet-600 dark:text-violet-400">
                                $
                                {(
                                    budgetItemForm.data.quantity *
                                    budgetItemForm.data.unit_price
                                ).toLocaleString(intlLocale())}
                            </span>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddBudgetItemOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={budgetItemForm.processing}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                            >
                                {__('Add Item')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 6. Add Expense Modal */}
            <Dialog
                open={isAddExpenseOpen}
                onOpenChange={(open) => !open && setIsAddExpenseOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Record Expense Claim')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitExpense} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="exp-no">
                                    {__('Expense Number *')}
                                </Label>
                                <Input
                                    id="exp-no"
                                    value={expenseForm.data.expense_number}
                                    onChange={(e) =>
                                        expenseForm.setData(
                                            'expense_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('e.g. EXP-2026-001')}
                                    required
                                />
                                {expenseForm.errors.expense_number && (
                                    <p className="text-sm text-destructive">
                                        {expenseForm.errors.expense_number}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="exp-desc">
                                    {__('Description/Title *')}
                                </Label>
                                <Input
                                    id="exp-desc"
                                    value={expenseForm.data.description}
                                    onChange={(e) =>
                                        expenseForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('Expense description')}
                                    required
                                />
                                {expenseForm.errors.description && (
                                    <p className="text-sm text-destructive">
                                        {expenseForm.errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddExpenseOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={expenseForm.processing}
                                className="bg-rose-600 text-white hover:bg-rose-700"
                            >
                                {__('Record Expense')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 7. Add Expense Item Modal */}
            <Dialog
                open={isAddExpenseItemOpen}
                onOpenChange={(open) => !open && setIsAddExpenseItemOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Add Expense Item to: :description', {
                                description: selectedExpense?.description,
                            })}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitExpenseItem} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="link-budget-item">
                                {__('Link to Budget Item')}
                            </Label>
                            <select
                                id="link-budget-item"
                                value={
                                    expenseItemForm.data
                                        .committee_budget_item_id
                                }
                                onChange={(e) =>
                                    expenseItemForm.setData(
                                        'committee_budget_item_id',
                                        e.target.value,
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                            >
                                <option value="">
                                    {__('Select Allocated Budget Item')}
                                </option>
                                {(committee.committeeBudgets || [])
                                    .flatMap(
                                        (b) => b.committeeBudgetItems || [],
                                    )
                                    .map((bi) => (
                                        <option key={bi.id} value={bi.id}>
                                            {bi.category} - {bi.description} (
                                            {__('Max: :amount', {
                                                amount:
                                                    '$' +
                                                    Number(
                                                        bi.total_amount,
                                                    ).toLocaleString(
                                                        intlLocale(),
                                                    ),
                                            })}
                                            )
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="exp-item-desc">
                                {__('Description *')}
                            </Label>
                            <Input
                                id="exp-item-desc"
                                value={expenseItemForm.data.description}
                                onChange={(e) =>
                                    expenseItemForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                placeholder={__('Item description')}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="exp-item-qty">
                                    {__('Quantity *')}
                                </Label>
                                <Input
                                    id="exp-item-qty"
                                    type="number"
                                    value={expenseItemForm.data.quantity}
                                    onChange={(e) => {
                                        const qty = Number(e.target.value);
                                        expenseItemForm.setData((prev) => ({
                                            ...prev,
                                            quantity: qty,
                                            total_amount: qty * prev.unit_price,
                                        }));
                                    }}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="exp-item-price">
                                    {__('Unit Price *')}
                                </Label>
                                <Input
                                    id="exp-item-price"
                                    type="number"
                                    value={expenseItemForm.data.unit_price}
                                    onChange={(e) => {
                                        const price = Number(e.target.value);
                                        expenseItemForm.setData((prev) => ({
                                            ...prev,
                                            unit_price: price,
                                            total_amount: prev.quantity * price,
                                        }));
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="exp-receipt">
                                {__('Receipt/Invoice Number')}
                            </Label>
                            <Input
                                id="exp-receipt"
                                value={expenseItemForm.data.receipt_number}
                                onChange={(e) =>
                                    expenseItemForm.setData(
                                        'receipt_number',
                                        e.target.value,
                                    )
                                }
                                placeholder={__('Receipt code...')}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddExpenseItemOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={expenseItemForm.processing}
                                className="bg-rose-600 text-white hover:bg-rose-700"
                            >
                                {__('Add Expense Item')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 8. Add Document Modal */}
            <Dialog
                open={isAddDocumentOpen}
                onOpenChange={(open) => !open && setIsAddDocumentOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Upload Committee Document')}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitDocument} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="doc-title">{__('Title *')}</Label>
                            <Input
                                id="doc-title"
                                value={documentForm.data.title}
                                onChange={(e) =>
                                    documentForm.setData(
                                        'title',
                                        e.target.value,
                                    )
                                }
                                placeholder={__('Document Title')}
                                required
                            />
                            {documentForm.errors.title && (
                                <p className="text-sm text-destructive">
                                    {documentForm.errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="doc-type">
                                {__('Document Type *')}
                            </Label>
                            <select
                                id="doc-type"
                                value={documentForm.data.document_type}
                                onChange={(e) =>
                                    documentForm.setData(
                                        'document_type',
                                        e.target.value as any,
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                required
                            >
                                <option value="proposal">
                                    {__('Proposal')}
                                </option>
                                <option value="tor">
                                    {__('TOR (Terms of Reference)')}
                                </option>
                                <option value="budget">
                                    {__('Budget Sheet')}
                                </option>
                                <option value="report">
                                    {__('Activity Report')}
                                </option>
                                <option value="photo">
                                    {__('Photo Documentation')}
                                </option>
                                <option value="certificate">
                                    {__('Certificate')}
                                </option>
                                <option value="other">{__('Other')}</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="doc-path">
                                {__('File Path / URL *')}
                            </Label>
                            <Input
                                id="doc-path"
                                value={documentForm.data.file_path}
                                onChange={(e) =>
                                    documentForm.setData(
                                        'file_path',
                                        e.target.value,
                                    )
                                }
                                placeholder={__(
                                    'e.g. /storage/documents/proposal.pdf',
                                )}
                                required
                            />
                            {documentForm.errors.file_path && (
                                <p className="text-sm text-destructive">
                                    {documentForm.errors.file_path}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddDocumentOpen(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={documentForm.processing}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                            >
                                {__('Upload Document')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CommitteeShow.layout = {
    breadcrumbs: [
        { title: __('Home'), href: '/' },
        { title: __('Committees'), href: '/committees' },
        { title: __('Cockpit'), href: '#' },
    ],
};
