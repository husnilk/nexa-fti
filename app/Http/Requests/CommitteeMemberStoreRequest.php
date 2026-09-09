<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeMemberStoreRequest extends FormRequest
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
            'supervisor_id' => ['nullable'],
            'user_id' => ['nullable'],
            'external_name' => ['nullable', 'string'],
            'role' => ['required', 'string'],
            'is_leader' => ['required'],
            'supervisor_id_id' => ['required', 'string', 'exists:committee_members,id'],
        ];
    }
}
