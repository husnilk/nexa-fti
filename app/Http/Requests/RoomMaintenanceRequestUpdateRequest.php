<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomMaintenanceRequestUpdateRequest extends FormRequest
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
            'room_id' => ['required', 'integer', 'exists:rooms.id,id'],
            'reported_by' => ['required'],
            'issue_description' => ['required', 'string'],
            'status' => ['required', 'in:reported,in_progress,resolved'],
            'reported_at' => ['required'],
            'resolved_at' => ['nullable'],
            'reported_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
