<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingStoreRequest extends FormRequest
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
            'committee_id' => ['nullable'],
            'title' => ['required', 'string'],
            'agenda' => ['nullable', 'string'],
            'meeting_type' => ['required', 'in:offline,online,hybrid'],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'room_id' => ['nullable', 'integer', 'exists:rooms,id'],
            'online_platform' => ['nullable', 'string'],
            'online_link' => ['nullable', 'string'],
            'organizer_id' => ['nullable'],
            'chairman_id' => ['nullable'],
            'status' => ['required', 'in:draft,scheduled,completed,cancelled'],
            'is_confidential' => ['required'],
            'organizer_id_id' => ['required', 'string', 'exists:employees,id'],
            'chairman_id_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
