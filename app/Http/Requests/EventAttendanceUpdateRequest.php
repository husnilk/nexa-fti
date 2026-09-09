<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventAttendanceUpdateRequest extends FormRequest
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
            'event_registration_id' => ['required', 'integer', 'exists:event_registrations,id'],
            'checked_in_at' => ['nullable'],
            'checked_out_at' => ['nullable'],
            'checked_by' => ['nullable'],
            'attendance_method' => ['required', 'in:manual,qr_scan,system'],
            'status' => ['required', 'in:present,absent,partial'],
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'checked_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
