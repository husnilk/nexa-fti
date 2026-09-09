<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentProcurementItemStoreRequest extends FormRequest
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
            'equipment_model_id' => ['nullable', 'integer', 'exists:equipment_models,id'],
            'name' => ['required', 'string'],
            'specification' => ['nullable', 'string'],
            'quantity' => ['required', 'integer'],
            'estimated_unit_price' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'purchase_link' => ['nullable', 'string'],
            'photo' => ['nullable', 'string'],
        ];
    }
}
