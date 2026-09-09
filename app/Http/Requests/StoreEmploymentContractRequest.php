<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmploymentContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('employment.manage');
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'unique:employment_contracts,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}
