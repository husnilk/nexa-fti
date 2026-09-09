<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingParticipantUpdateRequest extends FormRequest
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
            'user_id' => ['required'],
            'role' => ['required', 'in:participant,moderator,speaker,note_taker'],
            'attendance_status' => ['required', 'in:invited,attended,absent'],
            'check_in_time' => ['nullable'],
            'check_out_time' => ['nullable'],
            'attendance_method' => ['required', 'in:manual,qr_scan'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
