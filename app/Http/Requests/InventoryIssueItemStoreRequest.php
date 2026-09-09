<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventoryIssueItemStoreRequest extends FormRequest
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
            'inventory_issue_id' => ['required', 'integer', 'exists:inventory_issues.id,id'],
            'inventory_issue_item_id' => ['required', 'integer', 'exists:inventory_request_items.id,id'],
            'quantity' => ['required', 'integer'],
            'inventory_request_item_id' => ['required', 'integer', 'exists:inventory_request_items,id'],
        ];
    }
}
