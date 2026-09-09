<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentReceiptItemUpdateRequest extends FormRequest
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
            'equipment_receipt_id' => ['required', 'integer', 'exists:equipment_receipts.id,id'],
            'equipment_procurement_item_id' => ['required', 'integer', 'exists:equipment_procurement_items.id,id'],
            'unit_price' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'quantity' => ['required', 'integer'],
        ];
    }
}
