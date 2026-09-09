<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveBalanceUpdateRequest extends FormRequest
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
            'employee_id' => ['required', 'integer', 'exists:employees.id,id'],
            'leave_type_id' => ['required', 'integer', 'exists:leave_types.id,id'],
            'year' => ['required'],
            'quota' => ['required', 'integer'],
            'used' => ['required', 'integer'],
            'remaining' => ['required', 'integer'],
        ];
    }
}
