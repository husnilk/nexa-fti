import type { Employee } from './hr';

export type OvertimeStatus =
    | 'draft'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'completed'
    | 'cancelled';

export interface OvertimeRequest {
    id: string;
    request_number: string;
    title: string;
    description: string | null;
    request_date: string;
    planned_start_time: string;
    planned_end_time: string;
    submitted_by: string;
    approved_by: string | null;
    status: OvertimeStatus;
    submitted_at: string | null;
    approved_at: string | null;
    requester?: Employee;
    approver?: Employee;
    members?: OvertimeRequestMember[];
    approval_logs?: OvertimeApprovalLog[];
    members_count?: number;
    created_at: string;
    updated_at: string;
}

export interface OvertimeRequestMember {
    id: string;
    overtime_request_id: string;
    employee_id: string;
    role: string | null;
    job_desc: string | null;
    planned_hours: string | number;
    actual_start_time: string | null;
    actual_end_time: string | null;
    actual_hours: string | number | null;
    activity: string | null;
    outcome: string | null;
    employee?: Employee;
    created_at: string;
    updated_at: string;
}

export interface OvertimeApprovalLog {
    id: string;
    overtime_request_id: string;
    approver_id: string;
    status: 'approved' | 'rejected';
    notes: string | null;
    action_date: string | null;
    approver?: Employee;
    created_at: string;
    updated_at: string;
}
