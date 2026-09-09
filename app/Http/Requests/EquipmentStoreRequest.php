<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentStoreRequest extends FormRequest
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
            'equipment_model_id' => ['required', 'string', 'exists:equipment_models,id'],
            'equipment_number' => ['required', 'string', 'unique:equipment,equipment_number'],
            'serial_number' => ['nullable', 'string', 'unique:equipment,serial_number'],
            'acquisition_date' => ['nullable', 'date'],
            'acquisition_cost' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'residual_value' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'useful_life' => ['nullable', 'integer'],
            'condition' => ['required', 'in:excellent,good,fair,damaged,broken'],
            'status' => ['required', 'in:available,in_use,maintenance,disposed'],
            'qr_code' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
