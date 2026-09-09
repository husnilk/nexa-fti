<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('room.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Asset fields
            'asset_name' => ['required', 'string'],
            'asset_code' => ['required', 'string', 'unique:assets,code'],
            'acquisition_type' => ['required', 'string', 'in:procurement,grant'],
            'acquisition_date' => ['required', 'date'],
            'acquisition_cost' => ['nullable', 'numeric'],
            'condition' => ['required', 'string', 'in:good,minor_damage,major_damage'],
            'status' => ['required', 'string', 'in:available,in_use,maintenance,retired'],

            // Room fields
            'building_id' => ['required', 'uuid', 'exists:buildings,id'],
            'name' => ['required', 'string'],
            'code' => ['required', 'string', 'unique:rooms,code'],
            'floor' => ['nullable', 'string'],
            'capacity' => ['required', 'integer', 'min:1'],
            'is_public' => ['required', 'boolean'],
            'responsible_employee_id' => ['required', 'uuid', 'exists:employees,id'],
        ];
    }
}
