<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('hr.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // User data (optional if linking existing, but usually required for new)
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],

            // Employee data
            'emp_number' => ['required', 'string', 'max:255', 'unique:employees,emp_number'],
            'id_card_number' => ['required', 'string', 'max:255', 'unique:employees,id_card_number'],
            'tax_id_number' => ['nullable', 'string', 'max:255'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required', 'string', 'in:male,female'],
            'religion' => ['required', 'string', 'in:Islam,Kristen,Katolik,Hindu,Budha,Konghucu,Lainnya'],
            'marital_status' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:255'],
            'join_date' => ['required', 'date'],
            'employment_type_id' => ['required', 'uuid', 'exists:employment_types,id'],
            'supervisor_id' => ['nullable', 'uuid', 'exists:employees,id'],
            'status' => ['required', 'integer'],

            // Specialized data
            'specialization' => ['required', 'string', 'in:lecturer,staff'],

            // Lecturer fields (Optional)
            'academic_rank' => ['nullable', 'string', 'max:255'],
            'functional_position_id' => ['nullable', 'uuid', 'exists:functional_positions,id'],
            'nuptk' => ['nullable', 'string', 'max:255'],
            'expertise' => ['nullable', 'string'],

            // Staff fields (Optional)
            'position_id' => ['nullable', 'uuid', 'exists:positions,id'],
            'skills' => ['nullable', 'string'],
        ];
    }
}
