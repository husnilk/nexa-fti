<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeDocumentUpdateRequest extends FormRequest
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
            'committee_id' => ['required'],
            'title' => ['required', 'string'],
            'document_type' => ['required', 'in:proposal,tor,budget,report,photo,certificate,other'],
            'file_path' => ['required', 'string'],
            'uploaded_by' => ['required'],
            'uploaded_at' => ['required'],
            'uploaded_by_id' => ['required', 'string', 'exists:employees,id'],
        ];
    }
}
