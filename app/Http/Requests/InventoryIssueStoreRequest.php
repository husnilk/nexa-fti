<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryIssueStoreRequest extends FormRequest
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
            'inventory_request_id' => ['required', 'integer', 'exists:inventory_requests.id,id'],
            'warehouse_id' => ['required', 'integer', 'exists:warehouses.id,id'],
            'issue_number' => ['required', 'string', 'unique:inventory_issues,issue_number'],
            'issue_date' => ['required', 'date'],
            'issued_by' => ['required'],
            'issued_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
