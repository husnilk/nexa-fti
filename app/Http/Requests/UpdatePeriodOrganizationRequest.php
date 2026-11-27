<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePeriodOrganizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('period.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pagu' => ['required', 'numeric', 'min:0'],
            'pir_unit' => ['required', 'numeric', 'min:0'],
            'percentage' => ['required', 'numeric', 'between:0,100'],
            'sharing_method' => ['required', 'integer', Rule::in(array_keys(config('remun.sharing_methods')))],
            'finalization_state' => ['required', 'integer', Rule::in(array_keys(config('remun.finalization_states')))],
            'stage' => ['required', 'integer', Rule::in(array_keys(config('remun.stages')))],
        ];
    }
}
