<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentReceiptStoreRequest extends FormRequest
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
            'equipment_procurement_id' => ['required', 'string', 'exists:equipment_procurements,id'],
            'receipt_date' => ['required', 'date'],
            'supplier_name' => ['nullable', 'string'],
            'invoice_number' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.equipment_procurement_item_id' => ['required', 'string', 'exists:equipment_procurement_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['nullable', 'numeric'],
            'items.*.status' => ['required', 'in:accepted,rejected'],
            'items.*.rejection_reason' => ['required_if:items.*.status,rejected', 'nullable', 'string'],
        ];
    }
}
