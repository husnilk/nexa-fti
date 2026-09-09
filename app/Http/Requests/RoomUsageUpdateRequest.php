<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomUsageUpdateRequest extends FormRequest
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
            'user_id' => ['required', 'integer', 'exists:users.id,id'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'purpose' => ['nullable', 'string'],
            'status' => ['required', 'in:requested,approved,rejected,completed'],
            'approved_by' => ['nullable'],
            'approved_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
