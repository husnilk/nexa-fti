export interface PeriodMonth {
    id: string;
    period_id: string;
    month: number;
    workdays: number;
    created_at: string;
    updated_at: string;
}

export interface Period {
    id: string;
    year: number;
    no: number;
    name: string;
    description?: string | null;
    start_date: string;
    end_date: string;
    input_start_date: string;
    input_end_date: string;
    verification_start_date: string;
    verification_end_date: string;
    validation_start_date: string;
    validation_end_date: string;
    attendance: number;
    skp: number;
    skp_format: number;
    calc_method: number;
    performance: number;
    bkd_year: number;
    bkd_semester: string;
    p1_bkd_ref: number;
    p1_bkd_year: number;
    p1_bkd_semester: string;
    p2_bkd_ref: number;
    p2_bkd_year: number;
    p2_bkd_semester: string;
    status: number;
    pir: number;
    show_rupiah: number;
    user_confirmation: number;
    months?: PeriodMonth[];
    months_count?: number;
    organizations_count?: number;
    organizations_sum_pagu?: number | string | null;
    created_at: string;
    updated_at: string;
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface PeriodOptions {
    skpFormats: SelectOption[];
    calcMethods: SelectOption[];
    bkdSemesters: SelectOption[];
}

export interface PeriodOrganization {
    id: string;
    period_id: string;
    organization_id: string;
    pagu: number;
    pir_unit: number;
    sharing_method: number;
    finalization_state: number;
    stage: number;
    percentage: number;
    organization: {
        id: string;
        name: string;
        code: string;
        organization_type?: { id: string; name: string } | null;
    };
    created_at: string;
    updated_at: string;
}

export interface PeriodOrganizationOptions {
    sharingMethods: SelectOption[];
    finalizationStates: SelectOption[];
    stages: SelectOption[];
}

export interface RubricCategory {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    rubrics_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface RubricRegulation {
    id: string;
    name: string;
    regulation_number: string;
    regulation_year: string;
    description?: string | null;
    file_path?: string | null;
    is_active: number;
    rubrics_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface RubricDetail {
    id: string;
    rubric_id: string;
    position: string;
    poin: number;
    is_fixed_poin: number;
    is_active: number;
}

export interface RubricOrganization {
    id: string;
    rubric_id: string;
    organization_id: string;
    organization?: { id: string; name: string; code: string };
}

export interface EmploymentTypeOption {
    id: string;
    remun_status?: string | null;
    employee_type?: { id: string; name: string } | null;
    employment_contract?: { id: string | number; name: string } | null;
}

export interface RubricEmploymentType {
    id: string;
    rubric_id: string;
    employment_type_id: string;
    employment_type?: EmploymentTypeOption;
}

export interface Rubric {
    id: string;
    rubric_category_id: string;
    rubric_regulation_id: string;
    activity: string;
    code: string;
    description?: string | null;
    description_prove?: string | null;
    quantity: number;
    unit?: string | null;
    form_type: number;
    personal: number;
    assignment_file?: string | null;
    performance_file?: string | null;
    flat_rate: number;
    is_poin_fixed: number;
    is_extra_poin: number;
    is_rasionalized: number;
    is_general: number;
    is_active: number;
    is_flat_rate: number;
    rule_max_poin: number;
    rule_min_poin: number;
    rule_max_employee: number;
    rule_min_employee: number;
    category?: RubricCategory;
    regulation?: RubricRegulation;
    details?: RubricDetail[];
    organizations?: RubricOrganization[];
    employment_types?: RubricEmploymentType[];
    details_count?: number;
    organizations_count?: number;
    employment_types_count?: number;
    created_at: string;
    updated_at: string;
}

export interface RubricOptions {
    formTypes: SelectOption[];
}

export type AttendanceCountField =
    | 'present'
    | 'absent'
    | 'off_site_duty'
    | 'study_assignment'
    | 'sick_leave'
    | 'personal_leave'
    | 'long_service_leave'
    | 'maternity_leave'
    | 'unpaid_leave'
    | 'annual_leave'
    | 'special_leave'
    | 'late_01'
    | 'late_02'
    | 'late_03'
    | 'late_04'
    | 'late_05'
    | 'late_06'
    | 'early_departure_01'
    | 'early_departure_02'
    | 'early_departure_03'
    | 'early_departure_04'
    | 'early_departure_05'
    | 'early_departure_06'
    | 'maternity_leave_01'
    | 'maternity_leave_02'
    | 'maternity_leave_03';

export interface AttendanceEmployee {
    id: string;
    name: string;
    emp_number: string;
}

export interface AttendancePeriodOption {
    id: string;
    name: string;
    year: number;
    months: Pick<PeriodMonth, 'id' | 'period_id' | 'month'>[];
}

export type Attendance = {
    id: string;
    period_id: string;
    employee_id: string;
    year: number;
    month: number;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    employee?: AttendanceEmployee;
    period?: Pick<Period, 'id' | 'name' | 'year'>;
    creator?: { id: string; name: string } | null;
} & Record<AttendanceCountField, number | null>;

export interface EptEmployee {
    id: string;
    name: string;
    emp_number?: string;
}

export type EptPeriodOption = Pick<Period, 'id' | 'name' | 'year'>;

export interface Ept {
    id: string;
    employee_id: string;
    period_id: string;
    year: number | null;
    start: number | null;
    end: number | null;
    start_date: string | null;
    end_date: string | null;
    appraiser_officer_id: string | null;
    superior_appraiser_officer_id: string | null;
    orientation: number | null;
    integrity: number | null;
    commitment: number | null;
    discipline: number | null;
    teamwork: number | null;
    leadership: number | null;
    skp_achievement: number | null;
    work_result_rating: number | null;
    behavior_rating: number | null;
    performance_predicate: number | null;
    points: number | null;
    status: number | null;
    created_at: string;
    updated_at: string;
    employee?: EptEmployee;
    period?: EptPeriodOption;
    appraiser?: EptEmployee | null;
    superior_appraiser?: EptEmployee | null;
    creator?: { id: string; name: string } | null;
    updater?: { id: string; name: string } | null;
}

export interface ActivityRubricOption {
    id: string;
    code: string;
    activity: string;
}

export interface ActivityPerformance {
    id: string;
    employee_id: string;
    activity_id: string;
    rubric_detail_id: string | null;
    position: string | null;
    quantity: number | null;
    points: number | null;
    evidence_file: string | null;
    evidence_link: string | null;
    verification_status: number | null;
    verification_reason: string | null;
    verifier_id: string | null;
    verifier?: { id: string; name: string } | null;
    employee?: { id: string; name: string; emp_number: string };
    rubric_detail?: Pick<
        RubricDetail,
        'id' | 'position' | 'poin' | 'is_fixed_poin'
    > | null;
}

export interface Activity {
    id: string;
    period_id: string;
    rubric_id: string;
    name: string;
    organization_id: string | null;
    document_number: string | null;
    form_type: number | null;
    evidence_file: string | null;
    evidence_link: string | null;
    shared_performance_evidence: boolean;
    performance_evidence_file: string | null;
    performance_evidence_link: string | null;
    verifier_id: string | null;
    verifier?: { id: string; name: string } | null;
    created_at: string;
    updated_at: string;
    performances_count?: number;
    period?: Pick<Period, 'id' | 'name' | 'year'>;
    rubric?: ActivityRubricOption & {
        unit?: string | null;
        rule_max_employee?: number;
        details?: RubricDetail[];
    };
    organization?: { id: string; name: string } | null;
    creator?: { id: string; name: string } | null;
    performances?: ActivityPerformance[];
}

export interface Validator {
    id: string;
    organization_id: string | null;
    period_id: string;
    employee_id: string;
    position: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    employee?: { id: string; name: string; emp_number: string };
    organization?: { id: string; name: string } | null;
}
