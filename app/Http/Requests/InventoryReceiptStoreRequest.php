<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryReceiptStoreRequest extends FormRequest
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
            'inventory_procurement_id' => ['nullable', 'integer', 'exists:inventory_procurements,id'],
            'warehouse_id' => ['required', 'integer', 'exists:warehouses.id,id'],
            'receipt_number' => ['required', 'string', 'unique:inventory_receipts,receipt_number'],
            'receipt_date' => ['required', 'date'],
            'received_by' => ['required'],
            'received_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
