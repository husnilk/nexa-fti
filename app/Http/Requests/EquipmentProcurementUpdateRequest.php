<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentProcurementUpdateRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'request_date' => ['required', 'date'],
            'status' => ['sometimes', 'in:draft,pending,cancelled'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['nullable', 'string', 'exists:equipment_procurement_items,id'],
            'items.*.equipment_model_id' => ['required', 'string', 'exists:equipment_models,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.estimated_unit_price' => ['nullable', 'numeric'],
            'items.*.specification' => ['nullable', 'string'],
        ];
    }
}
