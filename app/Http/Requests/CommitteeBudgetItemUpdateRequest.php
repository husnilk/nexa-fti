<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommitteeBudgetItemUpdateRequest extends FormRequest
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
            'committee_budget_id' => ['required'],
            'category' => ['required', 'string'],
            'description' => ['required', 'string'],
            'quantity' => ['required', 'numeric', 'between:-9999999999.99,9999999999.99'],
            'unit_price' => ['required', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'total_amount' => ['required', 'numeric', 'between:-999999999999.99,999999999999.99'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
