<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventReminderUpdateRequest extends FormRequest
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
            'sent_by' => ['required'],
            'channel' => ['required', 'in:email,whatsapp,sms,system'],
            'message' => ['required', 'string'],
            'sent_at' => ['required'],
            'sent_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
