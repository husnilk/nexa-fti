<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmploymentTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('employment.manage');
    }

    public function rules(): array
    {
        return [
            'employee_type_id' => ['required', 'uuid', 'exists:employee_types,id'],
            'employment_contract_id' => ['required', 'integer', 'exists:employment_contracts,id'],
            'remun_status' => ['required', 'string', 'max:255'],
        ];
    }
}
