<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingMinuteStoreRequest extends FormRequest
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
            'version' => ['required', 'integer'],
            'summary' => ['required', 'string'],
            'decisions' => ['nullable', 'string'],
            'next_actions' => ['nullable', 'string'],
            'prepared_by' => ['nullable'],
            'approved_by' => ['nullable'],
            'approved_at' => ['nullable'],
            'is_final' => ['required'],
            'file_upload' => ['nullable', 'string'],
            'prepared_by_id' => ['required', 'string', 'exists:employees,id'],
            'approved_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
