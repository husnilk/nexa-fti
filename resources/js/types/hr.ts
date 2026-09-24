export interface Employee {
    id: string;
    emp_number: string;
    id_card_number?: string;
    tax_id_number?: string;
    name: string;
    birth_place?: string;
    birth_date?: string;
    email: string;
    gender: string;
    religion?: string;
    marital_status?: string;
    address?: string;
    phone?: string;
    join_date: string;
    status: number;
    employment_type_id?: string;
    supervisor_id?: string | null;
    employment_type?: {
        employee_type: { name: string };
        employment_contract: { name: string };
    };
    lecturer?: any;
    staff?: any;
    family_members?: any[];
    rank_histories?: EmployeeRankHistory[];
    created_at: string;
    updated_at: string;
}

export interface EmployeeRank {
    id: string;
    code: string;
    name: string;
    order: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface EmployeeRankHistory {
    id: string;
    employee_id: string;
    employee_rank_id: string;
    start_date: string;
    end_date?: string;
    effective_date: string;
    decree_number: string;
    decree_date: string;
    decree_file?: string;
    remarks?: string;
    rank?: EmployeeRank;
    created_at?: string;
    updated_at?: string;
}

export type * from './leave';
export type * from './overtime';
