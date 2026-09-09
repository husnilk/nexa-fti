<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentModelStoreRequest extends FormRequest
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
            'equipment_category_id' => ['required', 'string', 'exists:equipment_categories,id'],
            'manufacturer' => ['nullable', 'string'],
            'brand' => ['nullable', 'string'],
            'model_name' => ['required', 'string'],
            'specification' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'default_useful_life' => ['nullable', 'integer'],
        ];
    }
}
