<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrganizationTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('organization.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $organizationType = $this->route('organization_type') ?? $this->route('organizationType');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('organization_types', 'name')->ignore($organizationType),
            ],
            'level' => ['required', 'integer', 'min:1'],
        ];
    }
}
