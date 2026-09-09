<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryRequestStoreRequest extends FormRequest
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
            'request_number' => ['required', 'string', 'unique:inventory_requests,request_number'],
            'employee_id' => ['required', 'integer', 'exists:employees.id,id'],
            'request_date' => ['required', 'date'],
            'status' => ['required', 'in:pending,approved,rejected,fulfilled'],
            'approved_by' => ['nullable'],
            'approved_at' => ['nullable'],
            'approved_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
