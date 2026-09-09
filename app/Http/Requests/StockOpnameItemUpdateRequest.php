<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockOpnameItemUpdateRequest extends FormRequest
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
            'stock_opname_id' => ['required', 'integer', 'exists:stock_opnames.id,id'],
            'item_id' => ['required', 'integer', 'exists:items.id,id'],
            'system_quantity' => ['required', 'integer'],
            'physical_quantity' => ['required', 'integer'],
            'variance' => ['required', 'integer'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
