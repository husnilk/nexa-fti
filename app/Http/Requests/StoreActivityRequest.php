<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public const EVIDENCE_FILE_RULES = ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('activity.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'period_id' => ['required', 'uuid', 'exists:periods,id'],
            'rubric_id' => ['required', 'uuid', 'exists:rubrics,id'],
            'name' => ['required', 'string', 'max:255'],
            'organization_id' => ['nullable', 'uuid', 'exists:organizations,id'],
            'document_number' => ['nullable', 'string', 'max:255'],
            'verifier_id' => ['nullable', 'uuid', 'exists:users,id'],
            'evidence_file' => self::EVIDENCE_FILE_RULES,
            'evidence_link' => ['nullable', 'url', 'max:255'],
            'shared_performance_evidence' => ['boolean'],
            'performance_evidence_file' => self::EVIDENCE_FILE_RULES,
            'performance_evidence_link' => ['nullable', 'url', 'max:255'],
        ];
    }
}
