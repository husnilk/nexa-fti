<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentTypeStoreRequest;
use App\Http\Requests\DocumentTypeUpdateRequest;
use App\Models\DocumentType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentTypeController extends Controller
{
    /**
     * Authorize user access for document management.
     */
    protected function authorizeAccess(Request $request, string $permission = 'document.view'): void
    {
        if (! $request->user()->can($permission) && ! $request->user()->hasRole('super-admin')) {
            abort(403, 'Unauthorized.');
        }
    }

    public function index(Request $request): Response
    {
        $this->authorizeAccess($request, 'document.view');

        return Inertia::render('document-types/index', [
            'documentTypes' => DocumentType::all(),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorizeAccess($request, 'document.manage');

        return Inertia::render('document-types/create');
    }

    public function store(DocumentTypeStoreRequest $request): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        DocumentType::create($request->validated());

        return redirect()->route('document-types.index')->with('success', 'Document type created successfully.');
    }

    public function show(Request $request, DocumentType $documentType): Response
    {
        $this->authorizeAccess($request, 'document.view');

        return Inertia::render('document-types/show', [
            'documentType' => $documentType,
        ]);
    }

    public function edit(Request $request, DocumentType $documentType): Response
    {
        $this->authorizeAccess($request, 'document.manage');

        return Inertia::render('document-types/edit', [
            'documentType' => $documentType,
        ]);
    }

    public function update(DocumentTypeUpdateRequest $request, DocumentType $documentType): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        $documentType->update($request->validated());

        return redirect()->route('document-types.index')->with('success', 'Document type updated successfully.');
    }

    public function destroy(Request $request, DocumentType $documentType): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        $documentType->delete();

        return redirect()->route('document-types.index')->with('success', 'Document type deleted successfully.');
    }
}
