<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentMaintenanceRequestUpdateRequest extends FormRequest
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
            'equipment_id' => ['required', 'string', 'exists:equipment,id'],
            'problem_description' => ['required', 'string'],
            'priority' => ['required', 'in:low,medium,high'],
            'status' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
            'estimated_cost' => ['nullable', 'numeric'],
            'actual_cost' => ['nullable', 'numeric'],
        ];
    }
}
