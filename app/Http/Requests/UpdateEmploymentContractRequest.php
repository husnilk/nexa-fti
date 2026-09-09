<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmploymentContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('employment.manage');
    }

    public function rules(): array
    {
        $id = $this->route('employment_contract')->id;

        return [
            'id' => ['required', 'integer', 'unique:employment_contracts,id,'.$id],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}
