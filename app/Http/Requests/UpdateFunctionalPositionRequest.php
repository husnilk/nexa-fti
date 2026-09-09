<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFunctionalPositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('organizations.manage');
    }

    public function rules(): array
    {
        $id = $this->route('functional_position')->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255', 'unique:functional_positions,code,'.$id],
            'description' => ['nullable', 'string'],
            'level' => ['required', 'integer', 'min:0'],
            'grade' => ['required', 'integer', 'min:0'],
            'job_value' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
