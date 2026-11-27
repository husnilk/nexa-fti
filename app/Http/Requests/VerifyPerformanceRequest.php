<?php

namespace App\Http\Requests;

use App\Models\Performance;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VerifyPerformanceRequest extends FormRequest
{
    /**
     * Only the activity's verifier (or the verifier's supervisor, for the verifier's own performance).
     */
    public function authorize(): bool
    {
        /** @var Performance $performance */
        $performance = $this->route('performance');

        return $performance->canBeVerifiedBy($this->user());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'integer', Rule::in([
                Performance::VERIFICATION_APPROVED,
                Performance::VERIFICATION_REJECTED,
                Performance::VERIFICATION_RETURNED,
            ])],
            'reason' => [
                Rule::requiredIf(fn () => in_array((int) $this->input('status'), [
                    Performance::VERIFICATION_REJECTED,
                    Performance::VERIFICATION_RETURNED,
                ], true)),
                'nullable', 'string', 'max:191',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reason.required' => __('Please give a reason when rejecting or returning a performance.'),
        ];
    }
}
