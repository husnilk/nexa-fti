import type { Employee } from './hr';

export interface EquipmentCategory {
    id: string;
    name: string;
    description?: string;
    equipment_models?: EquipmentModel[];
    created_at: string;
    updated_at: string;
}

export interface EquipmentModel {
    id: string;
    equipment_category_id: number;
    manufacturer: string;
    brand: string;
    model_name: string;
    specification?: string;
    image?: string;
    default_useful_life?: number;
    equipment_category?: EquipmentCategory;
    equipment?: Equipment[];
    created_at: string;
    updated_at: string;
}

export interface Equipment {
    id: string;
    equipment_model_id: number;
    equipment_number: string;
    serial_number?: string;
    acquisition_date: string;
    acquisition_cost: string;
    residual_value: string;
    useful_life?: number;
    condition: string;
    status: string;
    qr_code?: string;
    notes?: string;
    equipment_model?: EquipmentModel;
    equipment_maintenance_requests?: EquipmentMaintenanceRequest[];
    created_at: string;
    updated_at: string;
}

export interface EquipmentProcurement {
    id: string;
    procurement_number: string;
    title: string;
    description?: string;
    requested_by: string;
    request_date: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    approved_by?: string;
    approved_at?: string;
    requested_by_employee?: Employee;
    approved_by_employee?: Employee;
    equipment_procurement_items?: EquipmentProcurementItem[];
    equipment_procurement_approvals?: EquipmentProcurementApproval[];
    equipment_procurement_items_count?: number;
    created_at: string;
    updated_at: string;
}

export interface EquipmentProcurementItem {
    id: string;
    equipment_procurement_id: string;
    equipment_model_id: string;
    name: string;
    specification?: string;
    quantity: number;
    estimated_unit_price?: string;
    purchase_link?: string;
    photo?: string;
    equipment_model?: EquipmentModel;
    created_at: string;
    updated_at: string;
}

export interface EquipmentReceipt {
    id: string;
    equipment_procurement_id: string;
    receipt_number: string;
    receipt_date: string;
    received_by: string;
    supplier_name?: string;
    invoice_number?: string;
    received_by_employee?: Employee;
    equipment_procurement?: EquipmentProcurement;
    equipment_receipt_items?: EquipmentReceiptItem[];
    equipment_receipt_items_count?: number;
    created_at: string;
    updated_at: string;
}

export interface EquipmentReceiptItem {
    id: string;
    equipment_receipt_id: string;
    equipment_procurement_item_id: string;
    unit_price?: string;
    quantity: number;
    status: 'accepted' | 'rejected';
    rejection_reason?: string;
    equipment_procurement_item?: EquipmentProcurementItem;
    created_at: string;
    updated_at: string;
}

export interface EquipmentProcurementApproval {
    id: string;
    equipment_procurement_id: string;
    approver_id: string;
    level: number;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    approved_at?: string;
    approver?: Employee;
    created_at: string;
    updated_at: string;
}

export interface Room {
    id: string;
    building_id: string;
    name: string;
    code: string;
    floor?: string;
    capacity: number;
    is_public: boolean;
    responsible_employee_id: string;
    responsible_employee?: Employee;
    created_at: string;
    updated_at: string;
}

export interface EquipmentDistribution {
    id: string;
    equipment_id: string;
    employee_id?: string;
    room_id?: string;
    assigned_date: string;
    returned_date?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'returned' | 'lost' | 'damaged';
    notes?: string;
    photo?: string;
    equipment?: Equipment;
    employee?: Employee;
    room?: Room;
    created_at: string;
    updated_at: string;
}

export interface EquipmentMaintenanceRequest {
    id: string;
    equipment_id: string;
    reported_by: string;
    report_date: string;
    problem_description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'resolved' | 'rejected';
    notes?: string;
    photo?: string;
    estimated_cost?: string;
    actual_cost?: string;
    equipment?: Equipment;
    reported_by_employee?: Employee;
    equipment_maintenance_activities?: EquipmentMaintenanceActivity[];
    created_at: string;
    updated_at: string;
}

export interface EquipmentMaintenanceActivity {
    id: string;
    equipment_maintenance_request_id: string;
    activity_date: string;
    description: string;
    cost?: string;
    performed_by: string;
    status: 'in_progress' | 'resolved';
    notes?: string;
    photo?: string;
    equipment_maintenance_request?: EquipmentMaintenanceRequest;
    created_at: string;
    updated_at: string;
}

export interface EquipmentUsageApproval {
    id: string;
    equipment_usage_id: string;
    approver_id: string;
    level: number;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    approved_at?: string;
    approver?: Employee;
    created_at: string;
    updated_at: string;
}

export interface EquipmentUsage {
    id: string;
    equipment_id: string;
    borrower_type: string;
    borrower_id: string;
    planned_start_date: string;
    planned_return_date: string;
    actual_start_date?: string;
    actual_return_date?: string;
    purpose?: string;
    status: 'requested' | 'approved' | 'rejected' | 'borrowed' | 'returned';
    approved_by?: string;
    equipment?: Equipment;
    borrower?: { id: string; name: string; email: string };
    approved_by_employee?: Employee;
    equipment_usage_approvals?: EquipmentUsageApproval[];
    created_at: string;
    updated_at: string;
}
