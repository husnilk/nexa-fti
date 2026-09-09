<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeAttendanceUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('hr.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'string', 'exists:employees,id'],
            'date' => ['required', 'date'],
            'check_in' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'check_out' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'break_in' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'break_out' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'status' => ['required', 'in:present,absent,leave,overtime,holiday'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
