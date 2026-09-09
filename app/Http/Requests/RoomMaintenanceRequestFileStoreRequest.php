<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomMaintenanceRequestFileStoreRequest extends FormRequest
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
            'room_maintenance_request_id' => ['required', 'integer', 'exists:room_maintenance_requests.id,id'],
            'file' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }
}
