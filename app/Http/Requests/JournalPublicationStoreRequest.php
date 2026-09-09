<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JournalPublicationStoreRequest extends FormRequest
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
            'publication_id' => ['required', 'integer', 'exists:publications,id', 'unique:journal_publications,publication_id'],
            'journal_name' => ['required', 'string'],
            'issn' => ['nullable', 'string'],
            'publisher' => ['nullable', 'string'],
            'volume' => ['nullable', 'string'],
            'issue' => ['nullable', 'string'],
            'pages' => ['nullable', 'string'],
            'indexing' => ['nullable', 'string'],
            'quartile' => ['nullable', 'string'],
        ];
    }
}
