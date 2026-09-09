<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentProcurementApprovalStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'equipment_procurement_id' => ['required', 'integer', 'exists:equipment_procurements.id,id'],
            'approver_id' => ['required', 'integer', 'exists:employees.id,id'],
            'level' => ['required', 'integer'],
            'status' => ['required', 'in:pending,approved,rejected'],
            'notes' => ['nullable', 'string'],
            'approved_at' => ['nullable'],
            'approver_id_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
