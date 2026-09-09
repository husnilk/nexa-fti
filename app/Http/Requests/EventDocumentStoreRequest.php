<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventDocumentStoreRequest extends FormRequest
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
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'title' => ['required', 'string'],
            'document_type' => ['required', 'in:report,photo,proposal,minutes,attendance,other'],
            'file_path' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'uploaded_by' => ['required'],
            'uploaded_at' => ['required'],
            'u_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
