<?php

namespace App\Http\Requests;

use App\Models\Period;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePeriodRequest extends FormRequest
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
        $period = $this->route('period');
        $bkdSemester = Rule::in(array_keys(config('remun.bkd_semesters')));

        return [
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'no' => [
                'required', 'integer', 'min:1',
                Rule::unique('periods', 'no')
                    ->where('year', $this->integer('year'))
                    ->ignore($period instanceof Period ? $period->id : null),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],

            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'input_start_date' => ['required', 'date'],
            'input_end_date' => ['required', 'date', 'after_or_equal:input_start_date'],
            'verification_start_date' => ['required', 'date', 'after_or_equal:input_start_date'],
            'verification_end_date' => ['required', 'date', 'after_or_equal:verification_start_date'],
            'validation_start_date' => ['required', 'date', 'after_or_equal:verification_start_date'],
            'validation_end_date' => ['required', 'date', 'after_or_equal:validation_start_date'],

            'attendance' => ['required', 'integer', 'in:0,1'],
            'skp' => ['required', 'integer', 'in:0,1'],
            'skp_format' => ['required', 'integer', Rule::in(array_keys(config('remun.skp_formats')))],
            'calc_method' => ['required', 'integer', Rule::in(array_keys(config('remun.calc_methods')))],
            'performance' => ['required', 'integer', 'in:0,1'],
            'pir' => ['required', 'numeric', 'min:0'],
            'show_rupiah' => ['required', 'integer', 'in:0,1'],
            'user_confirmation' => ['required', 'integer', 'in:0,1'],

            'bkd_year' => ['required', 'integer', 'min:0'],
            'bkd_semester' => ['required', 'string', $bkdSemester],
            'p1_bkd_ref' => ['required', 'integer', 'min:0'],
            'p1_bkd_year' => ['required', 'integer', 'min:0'],
            'p1_bkd_semester' => ['required', 'string', $bkdSemester],
            'p2_bkd_ref' => ['required', 'integer', 'min:0'],
            'p2_bkd_year' => ['required', 'integer', 'min:0'],
            'p2_bkd_semester' => ['required', 'string', $bkdSemester],

            'status' => ['required', 'integer', Rule::in([Period::STATUS_INACTIVE, Period::STATUS_ACTIVE])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'no.unique' => __('A period with this number already exists for the selected year.'),
        ];
    }
}
