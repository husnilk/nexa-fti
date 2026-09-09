<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentDepreciationUpdateRequest extends FormRequest
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
            'equipment_id' => ['required', 'integer', 'exists:equipments.id,id'],
            'depreciation_date' => ['required', 'date'],
            'acquisition_cost' => ['required', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'depreciation_amount' => ['required', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'book_value' => ['required', 'numeric', 'between:-999999999999.99,999999999999.99'],
        ];
    }
}
