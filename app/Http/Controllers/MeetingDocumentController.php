<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingDocumentStoreRequest;
use App\Http\Requests\MeetingDocumentUpdateRequest;
use App\Models\MeetingDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingDocumentController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:meeting.view|meeting.manage')->only(['index', 'show', 'create', 'edit']);
        $this->middleware('permission:meeting.manage')->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $meetingDocuments = MeetingDocument::with(['meeting', 'uploadedBy'])->get();

        return Inertia::render('meetings/documents/index', [
            'meetingDocuments' => $meetingDocuments,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('meetings/documents/create');
    }

    public function store(MeetingDocumentStoreRequest $request): RedirectResponse
    {
        $meetingDocument = MeetingDocument::create($request->validated());

        $request->session()->flash('meetingDocument.id', $meetingDocument->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Document uploaded successfully.');
        }

        return redirect()->route('meeting-documents.index')->with('success', 'Document uploaded successfully.');
    }

    public function show(Request $request, MeetingDocument $meetingDocument): Response
    {
        $meetingDocument->load(['meeting', 'uploadedBy']);

        return Inertia::render('meetings/documents/show', [
            'meetingDocument' => $meetingDocument,
        ]);
    }

    public function edit(Request $request, MeetingDocument $meetingDocument): Response
    {
        return Inertia::render('meetings/documents/edit', [
            'meetingDocument' => $meetingDocument,
        ]);
    }

    public function update(MeetingDocumentUpdateRequest $request, MeetingDocument $meetingDocument): RedirectResponse
    {
        $meetingDocument->update($request->validated());

        $request->session()->flash('meetingDocument.id', $meetingDocument->id);

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Document updated successfully.');
        }

        return redirect()->route('meeting-documents.index')->with('success', 'Document updated successfully.');
    }

    public function destroy(Request $request, MeetingDocument $meetingDocument): RedirectResponse
    {
        $meetingDocument->delete();

        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Document deleted successfully.');
        }

        return redirect()->route('meeting-documents.index')->with('success', 'Document deleted successfully.');
    }
}
