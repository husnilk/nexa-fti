<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRegistrationStoreRequest extends FormRequest
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
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'user_id' => ['required', 'string', 'exists:users,id'],
            'registration_number' => ['required', 'string', 'unique:event_registrations,registration_number'],
            'registered_at' => ['required'],
            'attendance_status' => ['required', 'in:registered,attended,no_show,cancelled'],
            'notes' => ['nullable', 'string'],
            'ticket_number' => ['required', 'string', 'unique:event_registrations,ticket_number'],
            'qr_code' => ['nullable', 'string'],
            'issued_at' => ['required'],
            'certificate_number' => ['required', 'string', 'unique:event_registrations,certificate_number'],
            'file_path' => ['nullable', 'string'],
            'generated_by' => ['nullable'],
            'generated_at' => ['nullable'],
        ];
    }
}
