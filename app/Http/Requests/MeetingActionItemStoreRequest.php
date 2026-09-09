<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingActionItemStoreRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'assigned_to' => ['nullable'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', 'in:open,in_progress,completed,cancelled'],
            'assigned_to_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
