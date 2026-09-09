<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryReceiptItemStoreRequest extends FormRequest
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
            'inventory_receipt_id' => ['required', 'integer', 'exists:inventory_receipts.id,id'],
            'inventory_procurement_item_id' => ['required', 'integer', 'exists:inventory_procurement_items.id,id'],
            'quantity' => ['required', 'integer'],
            'unit_price' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
        ];
    }
}
