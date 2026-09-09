<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentAuditDetailUpdateRequest extends FormRequest
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
            'equipment_audit_id' => ['required', 'integer', 'exists:equipment_audits.id,id'],
            'equipment_id' => ['required', 'integer', 'exists:equipments.id,id'],
            'condition' => ['required', 'in:excellent,good,fair,damaged,broken'],
            'found' => ['required'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
