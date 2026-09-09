<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeUpdateRequest extends FormRequest
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
            'code' => ['required', 'string', 'unique:committees,code'],
            'name' => ['required', 'string'],
            'objective' => ['nullable', 'string'],
            'expected_outcome' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'status' => ['required', 'in:draft,active,completed,cancelled'],
            'chairman_id' => ['nullable', 'string', 'exists:employees,id'],
            'organization_id' => ['nullable', 'string', 'exists:organizations,id'],
            'description' => ['nullable', 'string'],
            'chairman_id_id' => ['nullable', 'string'],
            'sponsor_unit_id_id' => ['nullable', 'string'],
        ];
    }
}
