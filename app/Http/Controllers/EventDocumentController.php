<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventDocumentStoreRequest;
use App\Http\Requests\EventDocumentUpdateRequest;
use App\Models\EventDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EventDocumentController extends Controller
{
    public function index(Request $request): View
    {
        $eventDocuments = EventDocument::all();

        return view('eventDocument.index', [
            'eventDocuments' => $eventDocuments,
        ]);
    }

    public function create(Request $request): View
    {
        return view('eventDocument.create');
    }

    public function store(EventDocumentStoreRequest $request): RedirectResponse
    {
        $eventDocument = EventDocument::create($request->validated());

        $request->session()->flash('eventDocument.id', $eventDocument->id);

        return redirect()->route('event-documents.index');
    }

    public function show(Request $request, EventDocument $eventDocument): View
    {
        return view('eventDocument.show', [
            'eventDocument' => $eventDocument,
        ]);
    }

    public function edit(Request $request, EventDocument $eventDocument): View
    {
        return view('eventDocument.edit', [
            'eventDocument' => $eventDocument,
        ]);
    }

    public function update(EventDocumentUpdateRequest $request, EventDocument $eventDocument): RedirectResponse
    {
        $eventDocument->update($request->validated());

        $request->session()->flash('eventDocument.id', $eventDocument->id);

        return redirect()->route('event-documents.index');
    }

    public function destroy(Request $request, EventDocument $eventDocument): RedirectResponse
    {
        $eventDocument->delete();

        return redirect()->route('event-documents.index');
    }
}
