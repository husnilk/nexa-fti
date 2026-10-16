<?php

namespace App\Http\Requests;

use App\Models\Activity;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UpdateActivityRequest extends StoreActivityRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Activity $activity */
        $activity = $this->route('activity');

        $rules = parent::rules();

        // Performances point at the rubric's positions, so the rubric is locked once employees are added.
        $rules['rubric_id'][] = function (string $attribute, mixed $value, Closure $fail) use ($activity) {
            if ($value !== $activity->rubric_id && $activity->performances()->exists()) {
                $fail(__('The rubric cannot be changed after employees have been added to the activity.'));
            }
        };

        return $rules;
    }
}
