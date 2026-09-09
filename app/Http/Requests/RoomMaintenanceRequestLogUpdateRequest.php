<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomMaintenanceRequestLogUpdateRequest extends FormRequest
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
            'log' => ['required', 'string'],
            'logged_by' => ['required'],
            'logged_at' => ['required'],
            'logged_file' => ['nullable', 'string'],
            'verified_by' => ['nullable'],
            'verified_at' => ['nullable'],
            'verification_file' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:reported,in_progress,resolved'],
            'logged_by_id' => ['required', 'integer', 'exists:Employees,id'],
            'verified_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
