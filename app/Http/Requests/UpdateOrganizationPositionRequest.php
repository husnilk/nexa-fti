<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrganizationPositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('organization.manage');
    }

    public function rules(): array
    {
        $organizationPosition = $this->route('organization_position') ?? $this->route('organizationPosition');

        return [
            'organization_id' => ['required', 'uuid', 'exists:organizations,id'],
            'position_id' => [
                'required',
                'uuid',
                'exists:positions,id',
                Rule::unique('organization_positions')
                    ->ignore($organizationPosition)
                    ->where(fn ($query) => $query
                        ->where('organization_id', $this->string('organization_id')->value())),
            ],
            'grade' => ['required', 'integer', 'min:0'],
            'job_value' => ['required', 'integer', 'min:0'],
            'cg' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
