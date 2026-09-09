<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommitteeDocumentStoreRequest;
use App\Http\Requests\CommitteeDocumentUpdateRequest;
use App\Models\CommitteeDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommitteeDocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $committeeDocuments = CommitteeDocument::with(['committee', 'uploadedBy'])->get();

        return Inertia::render('committees/documents/index', [
            'committeeDocuments' => $committeeDocuments,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('committees/documents/create');
    }

    public function store(CommitteeDocumentStoreRequest $request): RedirectResponse
    {
        $committeeDocument = CommitteeDocument::create($request->validated());

        $request->session()->flash('committeeDocument.id', $committeeDocument->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee document created successfully.');
        }

        return redirect()->route('committee-documents.index')->with('success', 'Committee document created successfully.');
    }

    public function show(Request $request, CommitteeDocument $committeeDocument): Response
    {
        $committeeDocument->load(['committee', 'uploadedBy']);

        return Inertia::render('committees/documents/show', [
            'committeeDocument' => $committeeDocument,
        ]);
    }

    public function edit(Request $request, CommitteeDocument $committeeDocument): Response
    {
        return Inertia::render('committees/documents/edit', [
            'committeeDocument' => $committeeDocument,
        ]);
    }

    public function update(CommitteeDocumentUpdateRequest $request, CommitteeDocument $committeeDocument): RedirectResponse
    {
        $committeeDocument->update($request->validated());

        $request->session()->flash('committeeDocument.id', $committeeDocument->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee document updated successfully.');
        }

        return redirect()->route('committee-documents.index')->with('success', 'Committee document updated successfully.');
    }

    public function destroy(Request $request, CommitteeDocument $committeeDocument): RedirectResponse
    {
        $committeeDocument->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Committee document deleted successfully.');
        }

        return redirect()->route('committee-documents.index')->with('success', 'Committee document deleted successfully.');
    }
}
