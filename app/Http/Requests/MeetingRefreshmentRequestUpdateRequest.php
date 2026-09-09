<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingRefreshmentRequestUpdateRequest extends FormRequest
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
            'requested_by' => ['nullable'],
            'request_date' => ['required', 'date'],
            'participant_count' => ['required', 'integer'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,pending,approved,rejected,fulfilled'],
            'approved_by' => ['nullable'],
            'approved_at' => ['nullable'],
            'requested_by_id' => ['required', 'string', 'exists:employees,id'],
            'approved_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
