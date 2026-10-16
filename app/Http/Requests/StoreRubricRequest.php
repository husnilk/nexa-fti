<?php

namespace App\Http\Requests;

use App\Models\Rubric;
use App\Models\RubricRegulation;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRubricRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('rubric.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rubric = $this->route('rubric');
        $flag = ['required', 'integer', 'in:0,1'];
        $limit = ['required', 'integer', 'min:-1'];

        return [
            'rubric_category_id' => ['required', 'uuid', 'exists:rubric_categories,id'],
            'rubric_regulation_id' => [
                'required', 'uuid',
                // New assignments need an active regulation; a rubric may keep its current one.
                Rule::exists('rubric_regulations', 'id')->where(fn ($query) => $query
                    ->where('is_active', RubricRegulation::STATUS_ACTIVE)
                    ->when($rubric instanceof Rubric, fn ($query) => $query->orWhere('id', $rubric->rubric_regulation_id))),
            ],
            'activity' => ['required', 'string', 'max:255'],
            'code' => [
                'required', 'string', 'max:50',
                Rule::unique('rubrics', 'code')
                    ->ignore($rubric instanceof Rubric ? $rubric->id : null),
            ],
            'description' => ['nullable', 'string'],
            'description_prove' => ['nullable', 'string'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'unit' => ['nullable', 'string', 'max:100'],
            'form_type' => ['required', 'integer', Rule::in(array_keys(config('remun.rubric_form_types')))],
            'personal' => $flag,
            'assignment_file' => ['nullable', 'string', 'max:255'],
            'performance_file' => ['nullable', 'string', 'max:255'],
            'flat_rate' => ['required', 'integer', 'min:0'],
            'is_poin_fixed' => $flag,
            'is_extra_poin' => $flag,
            'is_rasionalized' => $flag,
            'is_general' => $flag,
            'is_active' => $flag,
            'is_flat_rate' => $flag,
            'rule_max_poin' => $limit,
            'rule_min_poin' => $limit,
            'rule_max_employee' => $limit,
            'rule_min_employee' => $limit,

            'details' => ['required', 'array', 'min:1'],
            'details.*.id' => ['nullable', 'uuid'],
            'details.*.position' => ['required', 'string', 'max:255', 'distinct:ignore_case'],
            'details.*.poin' => ['required', 'numeric', 'min:0'],
            'details.*.is_fixed_poin' => $flag,
            'details.*.is_active' => $flag,

            'organization_ids' => ['nullable', 'array'],
            'organization_ids.*' => ['uuid', 'distinct', 'exists:organizations,id'],

            'employment_type_ids' => ['required', 'array', 'min:1'],
            'employment_type_ids.*' => ['uuid', 'distinct', 'exists:employment_types,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'rubric_regulation_id.exists' => __('The selected regulation is not active.'),
            'details.required' => __('A rubric must have at least one detail.'),
            'details.min' => __('A rubric must have at least one detail.'),
            'details.*.position.required' => __('Each detail needs a position.'),
            'details.*.position.distinct' => __('Each detail position must be unique.'),
            'employment_type_ids.required' => __('Select at least one employment type.'),
            'employment_type_ids.min' => __('Select at least one employment type.'),
        ];
    }
}
