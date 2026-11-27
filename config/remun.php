<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Period Options
    |--------------------------------------------------------------------------
    |
    | Selectable values for remuneration period settings, keyed by the value
    | stored in the database.
    |
    */

    'skp_formats' => [
        0 => 'Old Format',
        1 => 'New Format',
    ],

    'calc_methods' => [
        0 => 'Old calculation method',
        1 => 'New calculation method',
    ],

    'bkd_semesters' => [
        'Ganjil' => 'Ganjil',
        'Genap' => 'Genap',
    ],

    /*
    |--------------------------------------------------------------------------
    | Period Organization Options
    |--------------------------------------------------------------------------
    |
    | Selectable values for each organization's settings within a period.
    | TODO: replace the placeholder labels with the real meanings.
    |
    */

    'sharing_methods' => [
        0 => 'Method 0',
        1 => 'Method 1',
    ],

    'finalization_states' => [
        0 => 'Not finalized',
        1 => 'Finalized',
    ],

    'stages' => [
        0 => 'Stage 0',
        1 => 'Stage 1',
        2 => 'Stage 2',
    ],

    /*
    |--------------------------------------------------------------------------
    | Rubric Options
    |--------------------------------------------------------------------------
    |
    | Selectable values for rubric settings.
    | TODO: replace the placeholder labels with the real meanings.
    |
    */

    'rubric_form_types' => [
        0 => 'Form Type 0',
        1 => 'Form Type 1',
    ],

];
