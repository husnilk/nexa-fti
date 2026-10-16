<?php

namespace App\Http\Requests;

use App\Models\Period;
use App\Models\Validator;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreValidatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('validator.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Route model, not FormRequest::$validator.
        $existing = $this->route('validator');
        $periodId = $existing instanceof Validator ? $existing->period_id : Period::active()?->id;
        $organizationId = $this->input('organization_id');

        return [
            'employee_id' => [
                'required', 'uuid', 'exists:employees,id',
                Rule::unique('validators', 'employee_id')
                    ->where('period_id', $periodId)
                    ->where(fn ($query) => $organizationId
                        ? $query->where('organization_id', $organizationId)
                        : $query->whereNull('organization_id'))
                    ->ignore($existing instanceof Validator ? $existing->id : null),
            ],
            'organization_id' => ['nullable', 'uuid', 'exists:organizations,id'],
            'position' => ['required', 'integer', Rule::in([Validator::POSITION_CHAIR, Validator::POSITION_MEMBER])],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.unique' => __('This employee is already a validator for the selected organization in this period.'),
        ];
    }
}
