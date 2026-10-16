<?php

namespace App\Http\Requests;

use App\Models\Period;
use App\Models\PeriodMonth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePeriodMonthRequest extends FormRequest
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
        /** @var Period $period */
        $period = $this->route('period');
        $month = $this->route('month');

        return [
            'month' => [
                'required', 'integer', 'between:1,12',
                Rule::unique('period_months', 'month')
                    ->where('period_id', $period->id)
                    ->ignore($month instanceof PeriodMonth ? $month->id : null),
            ],
            'workdays' => ['required', 'integer', 'between:0,31'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'month.unique' => __('This month has already been added to the period.'),
        ];
    }
}
