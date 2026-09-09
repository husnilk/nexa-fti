<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicationStoreRequest extends FormRequest
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
            'type' => ['required', 'string', 'in:journal,conference'],
            'title' => ['required', 'string'],
            'publication_date' => ['required', 'date'],
            'doi' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
            'abstract' => ['nullable', 'string'],
            'research_id' => ['nullable', 'string', 'exists:research,id'],

            // Journal specific
            'journal_name' => ['required_if:type,journal', 'nullable', 'string'],
            'issn' => ['nullable', 'string'],
            'publisher' => ['nullable', 'string'],
            'volume' => ['nullable', 'string'],
            'issue' => ['nullable', 'string'],
            'pages' => ['nullable', 'string'],
            'indexing' => ['nullable', 'string'],
            'quartile' => ['nullable', 'string'],

            // Conference specific
            'conference_name' => ['required_if:type,conference', 'nullable', 'string'],
            'conference_location' => ['nullable', 'string'],
            'conference_date' => ['nullable', 'date'],
            'isbn' => ['nullable', 'string'],
        ];
    }
}
