<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cookie;

class LocaleController extends Controller
{
    /**
     * Remember the chosen interface language for a year and go back.
     */
    public function update(string $locale): RedirectResponse
    {
        abort_unless(array_key_exists($locale, config('app.available_locales')), 404);

        Cookie::queue('locale', $locale, 60 * 24 * 365);

        return redirect()->back();
    }
}
