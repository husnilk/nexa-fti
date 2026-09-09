<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryAdjustmentStoreRequest extends FormRequest
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
            'stock_opname_item_id' => ['required', 'integer', 'exists:stock_opname_items.id,id'],
            'warehouse_id' => ['required', 'integer', 'exists:warehouses.id,id'],
            'item_id' => ['required', 'integer', 'exists:items.id,id'],
            'adjustment_quantity' => ['required', 'integer'],
            'reason' => ['nullable', 'string'],
            'adjusted_by' => ['required'],
            'adjustment_date' => ['required'],
            'adjusted_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
