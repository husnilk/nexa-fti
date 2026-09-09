<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryRequestApprovalStoreRequest extends FormRequest
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
            'approver_id' => ['required', 'integer', 'exists:employees.id,id'],
            'status' => ['required', 'in:approved,rejected'],
            'notes' => ['nullable', 'string'],
            'action_date' => ['required'],
            'approver_id_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
