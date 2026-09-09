<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePositionResponsibilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('organizations.manage');
    }

    public function rules(): array
    {
        return [
            'position_id' => ['required', 'uuid', 'exists:positions,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:primary,secondary'],
            'order' => ['required', 'integer', 'min:0'],
        ];
    }
}
