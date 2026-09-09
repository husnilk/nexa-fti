<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentDistributionStoreRequest extends FormRequest
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
            'equipment_id' => ['required', 'string', 'exists:equipment,id'],
            'employee_id' => ['nullable', 'required_without:room_id', 'string', 'exists:employees,id'],
            'room_id' => ['nullable', 'required_without:employee_id', 'string', 'exists:rooms,id'],
            'assigned_date' => ['required', 'date'],
            'status' => ['required', 'in:pending,accepted,rejected,returned,lost,damaged'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->employee_id && $this->room_id) {
                $validator->errors()->add('employee_id', 'You can distribute to a room or to a user. But not both.');
                $validator->errors()->add('room_id', 'You can distribute to a room or to a user. But not both.');
            }
        });
    }
}
