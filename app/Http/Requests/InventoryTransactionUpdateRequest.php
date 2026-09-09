<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryTransactionUpdateRequest extends FormRequest
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
            'warehouse_id' => ['required', 'integer', 'exists:warehouses.id,id'],
            'item_id' => ['required', 'integer', 'exists:items.id,id'],
            'type' => ['required', 'in:in,out,adjustment'],
            'quantity' => ['required', 'integer'],
            'balance_after' => ['required', 'integer'],
            'transaction_date' => ['required', 'date'],
            'reference' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
