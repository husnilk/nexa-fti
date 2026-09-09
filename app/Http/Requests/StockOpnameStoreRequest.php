<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockOpnameStoreRequest extends FormRequest
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
            'opname_number' => ['required', 'string', 'unique:stock_opnames,opname_number'],
            'opname_date' => ['required', 'date'],
            'conducted_by' => ['required'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,completed'],
            'conducted_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
