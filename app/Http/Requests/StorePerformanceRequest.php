<?php

namespace App\Http\Requests;

use App\Models\Activity;
use App\Models\Performance;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePerformanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('activity.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Activity $activity */
        $activity = $this->route('activity');
        $performance = $this->route('performance');
        $isCreating = ! $performance instanceof Performance;

        return [
            'employee_id' => [
                'required', 'uuid', 'exists:employees,id',
                Rule::unique('performances', 'employee_id')
                    ->where('activity_id', $activity->id)
                    ->whereNull('deleted_at')
                    ->ignore($isCreating ? null : $performance->id),
                function (string $attribute, mixed $value, Closure $fail) use ($activity, $isCreating) {
                    $max = $activity->rubric?->rule_max_employee ?? -1;

                    if ($isCreating && $max >= 0 && $activity->performances()->count() >= $max) {
                        $fail(__('This rubric allows at most :max employees per activity.', ['max' => $max]));
                    }
                },
            ],
            'rubric_detail_id' => [
                'required', 'uuid',
                Rule::exists('rubric_details', 'id')->where('rubric_id', $activity->rubric_id),
            ],
            'quantity' => ['required', 'numeric', 'min:0', 'max:9999'],
            'points' => ['nullable', 'numeric', 'min:0', 'max:99999'],
            'evidence_file' => StoreActivityRequest::EVIDENCE_FILE_RULES,
            'evidence_link' => ['nullable', 'url', 'max:191'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.unique' => __('This employee is already part of the activity.'),
            'rubric_detail_id.exists' => __('Choose a position from this activity\'s rubric.'),
        ];
    }
}
