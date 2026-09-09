<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('students.manage');
    }

    public function rules(): array
    {
        $student = $this->route('student');

        return [
            'name' => ['required', 'string', 'max:255'],
            'reg_no' => ['required', 'string', 'max:255', 'unique:students,reg_no,'.$student->id],
            'reg_date' => ['required', 'date'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'gender' => ['required', 'string', 'in:male,female'],
            'religion' => ['required', 'string', 'in:Islam,Kristen,Katolik,Hindu,Budha,Konghucu,Lainnya'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$student->id],
            'campus_email' => ['nullable', 'string', 'email', 'max:255', 'unique:students,campus_email,'.$student->id],
            'phone_no' => ['nullable', 'string', 'max:255'],
            'home_address' => ['nullable', 'string'],
            'home_town' => ['nullable', 'string', 'max:255'],
            'home_province' => ['nullable', 'string', 'max:255'],
            'home_postalcode' => ['nullable', 'string', 'max:10'],
            'current_address' => ['nullable', 'string'],
            'current_town' => ['nullable', 'string', 'max:255'],
            'current_province' => ['nullable', 'string', 'max:255'],
            'current_postalcode' => ['nullable', 'string', 'max:10'],
            'department_id' => ['required', 'uuid', 'exists:organizations,id'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'status' => ['required', 'string', 'in:active,inactive,graduated,withdrawn,on_leave'],
            'advisor_id' => ['nullable', 'uuid', 'exists:lecturers,id'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }
}
