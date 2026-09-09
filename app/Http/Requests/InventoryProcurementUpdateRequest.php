<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryProcurementUpdateRequest extends FormRequest
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
            'request_number' => ['required', 'string', 'unique:inventory_procurements,request_number'],
            'title' => ['required', 'string'],
            'status' => ['required', 'in:draft,submitted,approved,rejected'],
            'created_by' => ['required'],
            'approved_at' => ['nullable'],
            'created_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
