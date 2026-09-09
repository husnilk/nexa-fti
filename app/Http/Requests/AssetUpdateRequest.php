<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssetUpdateRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'code' => ['required', 'string', 'unique:assets,code'],
            'type' => ['required', 'in:equipment,room'],
            'acquisition_type' => ['required', 'in:procurement,grant'],
            'acquisition_date' => ['required', 'date'],
            'acquisition_cost' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'asset_grant_id' => ['nullable', 'integer', 'exists:asset_grants,id'],
            'condition' => ['required', 'in:good,minor_damage,major_damage'],
            'status' => ['required', 'in:available,in_use,maintenance,retired'],
        ];
    }
}
