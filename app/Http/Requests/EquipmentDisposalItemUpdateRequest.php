<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentDisposalItemUpdateRequest extends FormRequest
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
            'equipment_disposal_id' => ['required', 'integer', 'exists:equipment_disposals.id,id'],
            'equipment_id' => ['required', 'integer', 'exists:equipments.id,id'],
            'book_value' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'disposal_value' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
