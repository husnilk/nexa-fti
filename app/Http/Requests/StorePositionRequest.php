<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('organizations.manage');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'uuid', 'exists:positions,id'],
            'grade' => ['required', 'integer', 'min:0'],
            'job_value' => ['required', 'integer', 'min:0'],
            'cg' => ['required', 'integer', 'min:0'],
            'skp_point' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'integer', 'in:0,1'],
            'qualification' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }
}
