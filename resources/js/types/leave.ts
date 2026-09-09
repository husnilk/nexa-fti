import { User } from './auth';
import type { Employee } from './index'; // Wait, let's check where Employee is defined

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveType {
    id: number;
    name: string;
    code: string;
    description?: string;
    default_quota: number;
    requires_attachment: boolean;
}

export interface LeaveApproval {
    id: string;
    leave_request_id: string;
    approver_id: string;
    level: number;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    action_date?: string;
    approver?: Employee;
}

export interface LeaveRequest {
    id: string;
    employee_id: string;
    leave_type_id: number;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    attachment?: string;
    address_leave?: string;
    contact_leave?: string;
    status: LeaveStatus;
    submitted_at?: string;
    approved_at?: string;
    employee?: Employee;
    leave_type?: LeaveType;
    leave_approvals?: LeaveApproval[];
}
