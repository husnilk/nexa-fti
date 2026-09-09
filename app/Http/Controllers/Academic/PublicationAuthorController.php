<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicationAuthorStoreRequest;
use App\Http\Requests\PublicationAuthorUpdateRequest;
use App\Models\PublicationAuthor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PublicationAuthorController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:publication.manage');
    }

    public function store(PublicationAuthorStoreRequest $request): RedirectResponse
    {
        PublicationAuthor::create($request->validated());

        return back()->with('success', 'Author added successfully.');
    }

    public function update(PublicationAuthorUpdateRequest $request, PublicationAuthor $publicationAuthor): RedirectResponse
    {
        $publicationAuthor->update($request->validated());

        return back()->with('success', 'Author updated successfully.');
    }

    public function destroy(Request $request, PublicationAuthor $publicationAuthor): RedirectResponse
    {
        $publicationAuthor->delete();

        return back()->with('success', 'Author removed successfully.');
    }
}
