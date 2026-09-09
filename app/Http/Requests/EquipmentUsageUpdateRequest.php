<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentUsageUpdateRequest extends FormRequest
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
            'planned_start_date' => ['required', 'date'],
            'planned_return_date' => ['required', 'date', 'after:planned_start_date'],
            'purpose' => ['nullable', 'string'],
        ];
    }
}
