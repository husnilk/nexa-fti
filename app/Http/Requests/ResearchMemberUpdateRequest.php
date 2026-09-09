<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResearchMemberUpdateRequest extends FormRequest
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
            'research_id' => ['required', 'string', 'exists:research,id'],
            'user_id' => ['required', 'string', 'exists:users,id'],
            'role' => ['nullable', 'string'],
        ];
    }
}
