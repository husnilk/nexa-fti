<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingExternalParticipantStoreRequest extends FormRequest
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
            'meeting_id' => ['required'],
            'name' => ['required', 'string'],
            'institution' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'role' => ['required', 'in:participant,speaker,guest'],
            'attendance_status' => ['required', 'in:invited,attended,absent'],
            'check_in_time' => ['nullable'],
            'check_out_time' => ['nullable'],
            'attendance_method' => ['required', 'in:manual,qr_scan'],
        ];
    }
}
