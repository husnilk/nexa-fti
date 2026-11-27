<?php

namespace App\Http\Requests;

use App\Models\Attendance;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('attendance.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $attendance = $this->route('attendance');

        return [
            'period_id' => ['required', 'uuid', 'exists:periods,id'],
            'employee_id' => [
                'required', 'uuid', 'exists:employees,id',
                Rule::unique('attendances', 'employee_id')
                    ->where('period_id', $this->input('period_id'))
                    ->where('year', $this->input('year'))
                    ->where('month', $this->input('month'))
                    ->ignore($attendance instanceof Attendance ? $attendance->id : null),
            ],
            'year' => ['required', 'integer', 'between:2000,2100'],
            'month' => ['required', 'integer', 'between:1,12'],
            ...array_fill_keys(Attendance::COUNT_FIELDS, ['nullable', 'integer', 'between:0,31']),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.unique' => __('This employee already has an attendance record for the selected period and month.'),
        ];
    }
}
