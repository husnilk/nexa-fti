<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EquipmentDisposalUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'disposal_number' => [
                'required',
                'string',
                Rule::unique('equipment_disposals', 'disposal_number')->ignore($this->route('equipmentDisposal')),
            ],
            'disposal_date' => ['required', 'date'],
            'title' => ['required', 'string'],
            'reason' => ['nullable', 'string'],
            'disposal_method' => ['required', 'in:sold,donated,scrapped,lost,mutation'],
            'status' => ['required', 'in:draft,pending,approved,rejected,completed'],
            'proposed_by' => ['nullable'],
            'approved_by' => ['nullable'],
            'approved_at' => ['nullable'],
            'notes' => ['nullable', 'string'],
            'proposed_by_id' => ['required', 'string', 'exists:employees,id'],
            'approved_by_id' => ['nullable', 'string', 'exists:employees,id'],
        ];
    }
}
