<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublicationAuthorStoreRequest extends FormRequest
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
            'publication_id' => ['required', 'string', 'exists:publications,id'],
            'author_id' => ['required', 'string', 'exists:users,id'],
            'author_order' => ['required', 'integer'],
            'is_corresponding' => ['boolean'],
            'user_id' => ['required', 'string', 'exists:users,id'],
        ];
    }
}
