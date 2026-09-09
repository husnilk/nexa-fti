<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomMaintenanceRequestLogFileStoreRequest extends FormRequest
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
            'room_maintenance_request_log_id' => ['required', 'integer', 'exists:room_maintenance_request_logs.id,id'],
            'file' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }
}
