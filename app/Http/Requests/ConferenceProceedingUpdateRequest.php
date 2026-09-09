<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConferenceProceedingUpdateRequest extends FormRequest
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
            'publication_id' => ['required', 'integer', 'exists:publications,id', 'unique:conference_proceedings,publication_id'],
            'conference_name' => ['required', 'string'],
            'conference_location' => ['nullable', 'string'],
            'conference_date' => ['nullable', 'date'],
            'publisher' => ['nullable', 'string'],
            'isbn' => ['nullable', 'string'],
            'pages' => ['nullable', 'string'],
            'indexing' => ['nullable', 'string'],
        ];
    }
}
