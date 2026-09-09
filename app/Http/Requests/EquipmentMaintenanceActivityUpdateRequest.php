<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentMaintenanceActivityUpdateRequest extends FormRequest
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
            'equipment_maintenance_request_id' => ['required', 'integer', 'exists:equipment_maintenance_requests.id,id'],
            'activity_date' => ['required'],
            'description' => ['required', 'string'],
            'cost' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'performed_by' => ['nullable', 'string'],
            'status' => ['required', 'in:in_progress,resolved'],
            'notes' => ['nullable', 'string'],
            'photo' => ['nullable', 'string'],
        ];
    }
}
