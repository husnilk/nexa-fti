<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventStoreRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'slug' => ['required', 'string', 'unique:events,slug'],
            'description' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
            'event_type' => ['required', 'in:seminar,workshop,training,conference,webinar,other'],
            'delivery_mode' => ['required', 'in:offline,online,hybrid'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'start_time' => ['nullable'],
            'end_time' => ['nullable'],
            'venue' => ['nullable', 'string'],
            'online_platform' => ['nullable', 'string'],
            'online_link' => ['nullable', 'string'],
            'quota' => ['nullable', 'integer'],
            'registration_deadline' => ['nullable'],
            'cover_image' => ['nullable', 'string'],
            'banner_image' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published,ongoing,completed,cancelled'],
            'created_by' => ['required', 'string', 'exists:employees,id'],
            'published_by' => ['nullable', 'string', 'exists:employees,id'],
            'published_at' => ['nullable'],
            'created_by_id' => ['required', 'string', 'exists:employees,id'],
            'published_by_id' => ['nullable', 'string', 'exists:employees,id'],
        ];
    }
}
