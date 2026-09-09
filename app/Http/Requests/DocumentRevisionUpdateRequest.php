<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentRevisionUpdateRequest extends FormRequest
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
            'document_id' => ['required', 'exists:documents,id'],
            'revision_date' => ['required', 'date'],
            'doc_date' => ['nullable', 'integer', 'min:1', 'max:31'],
            'doc_month' => ['nullable', 'integer', 'min:1', 'max:12'],
            'doc_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'file' => ['nullable', 'file', 'max:20480'],
            'active' => ['nullable', 'boolean'],
        ];
    }
}
