<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingDocumentStoreRequest extends FormRequest
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
            'meeting_id' => ['required'],
            'title' => ['required', 'string'],
            'document_type' => ['required', 'in:photo,minutes,presentation,recording,attendance,other'],
            'file_path' => ['required', 'string'],
            'uploaded_by' => ['required'],
            'uploaded_at' => ['required'],
            'uploaded_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
