<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryProcurementItemStoreRequest extends FormRequest
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
            'inventory_procurement_id' => ['required', 'integer', 'exists:inventory_procurements.id,id'],
            'item_id' => ['nullable', 'integer', 'exists:items,id'],
            'item_name' => ['nullable', 'string'],
            'quantity' => ['required', 'integer'],
        ];
    }
}
