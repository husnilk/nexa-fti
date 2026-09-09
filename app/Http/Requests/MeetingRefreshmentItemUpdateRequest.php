<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingRefreshmentItemUpdateRequest extends FormRequest
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
            'meeting_refreshment_request_id' => ['required'],
            'item_name' => ['required', 'string'],
            'quantity' => ['required', 'integer'],
            'estimated_cost' => ['nullable', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
