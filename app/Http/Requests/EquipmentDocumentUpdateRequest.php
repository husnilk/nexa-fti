<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipmentDocumentUpdateRequest extends FormRequest
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
            'equipment_id' => ['required', 'integer', 'exists:equipments.id,id'],
            'title' => ['required', 'string'],
            'document_type' => ['required', 'in:invoice,warranty,manual,photo,other'],
            'file_path' => ['required', 'string'],
            'uploaded_by' => ['required'],
            'uploaded_at' => ['required'],
            'uploaded_by_id' => ['required', 'integer', 'exists:Employees,id'],
        ];
    }
}
