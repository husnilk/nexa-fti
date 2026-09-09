<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventCommitteeMemberUpdateRequest extends FormRequest
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
            'employee_id' => ['required', 'string', 'exists:employees,id'],
            'role' => ['required', 'string'],
            'is_leader' => ['required'],
        ];
    }
}
