<?php

namespace App\Http\Requests;

use App\Models\Ept;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEptRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('ept.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'uuid', 'exists:employees,id'],
            'period_id' => ['required', 'uuid', 'exists:periods,id'],
            'year' => ['required', 'integer', 'between:2000,2100'],
            'start' => ['nullable', 'integer', 'between:1,12'],
            'end' => ['nullable', 'integer', 'between:1,12', 'gte:start'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'appraiser_officer_id' => ['nullable', 'uuid', 'exists:employees,id', 'different:employee_id'],
            'superior_appraiser_officer_id' => ['nullable', 'uuid', 'exists:employees,id', 'different:employee_id'],
            ...array_fill_keys(Ept::BEHAVIOR_ASPECTS, ['nullable', 'integer', 'between:0,100']),
            'skp_achievement' => ['nullable', 'numeric', 'between:0,200'],
            'work_result_rating' => ['nullable', 'integer', 'between:1,3'],
            'behavior_rating' => ['nullable', 'integer', 'between:1,3'],
            'performance_predicate' => ['nullable', 'integer', 'between:1,5'],
            'points' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'integer', 'in:'.implode(',', [Ept::STATUS_DRAFT, Ept::STATUS_SUBMITTED, Ept::STATUS_VERIFIED])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'appraiser_officer_id.different' => __('The appraiser must be a different employee.'),
            'superior_appraiser_officer_id.different' => __('The superior appraiser must be a different employee.'),
        ];
    }
}
