<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentStoreRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'document_type_id' => ['required', 'exists:document_types,id'],
            'organisation_id' => ['required', 'exists:organizations,id'],
            'document_no' => ['nullable', 'string'],
            'publish_status' => ['required', 'in:draft,published,archived'],
            'published_by' => ['nullable', 'exists:employees,id'],
            'published_at' => ['nullable', 'date'],
            'archived_by' => ['nullable', 'exists:employees,id'],
            'archived_at' => ['nullable', 'date'],
            'published_by_id' => ['nullable', 'exists:employees,id'],
            'archived_by_id' => ['nullable', 'exists:employees,id'],
            'file' => ['nullable', 'file', 'max:20480'],
            'revision_date' => ['nullable', 'date'],
            'doc_date' => ['nullable', 'integer', 'min:1', 'max:31'],
            'doc_month' => ['nullable', 'integer', 'min:1', 'max:12'],
            'doc_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
        ];
    }
}
