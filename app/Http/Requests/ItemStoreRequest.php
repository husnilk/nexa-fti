<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemStoreRequest extends FormRequest
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
            'item_category_id' => ['required', 'integer', 'exists:item_categories.id,id'],
            'name' => ['required', 'string'],
            'code' => ['required', 'string', 'unique:items,code'],
            'unit' => ['required', 'string'],
            'minimal_quantity' => ['required', 'integer'],
            'description' => ['nullable', 'string'],
        ];
    }
}
