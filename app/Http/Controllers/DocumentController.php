<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentStoreRequest;
use App\Http\Requests\DocumentUpdateRequest;
use App\Models\Document;
use App\Models\DocumentRevision;
use App\Models\DocumentType;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    /**
     * Authorize user access for document management.
     */
    protected function authorizeAccess(Request $request, string $permission = 'document.view'): void
    {
        if (! $request->user()->can($permission) && ! $request->user()->hasRole('super-admin')) {
            abort(403, 'Unauthorized. Only users with '.$permission.' permission can perform this action.');
        }
    }

    public function index(Request $request): Response
    {
        $this->authorizeAccess($request, 'document.view');

        $query = Document::with(['documentType', 'organization', 'documentRevisions' => function ($q) {
            $q->where('active', true);
        }]);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('document_no', 'like', "%{$search}%")
                    ->orWhereHas('documentType', function ($typeQuery) use ($search) {
                        $typeQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter functionality
        if ($request->filled('status')) {
            $query->where('publish_status', $request->input('status'));
        }

        if ($request->filled('type')) {
            $query->where('document_type_id', $request->input('type'));
        }

        return Inertia::render('documents/index', [
            'documents' => $query->latest()->get(),
            'documentTypes' => DocumentType::all(),
            'filters' => $request->all('search', 'status', 'type'),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorizeAccess($request, 'document.manage');

        return Inertia::render('documents/create', [
            'documentTypes' => DocumentType::all(),
            'organizations' => Organization::where('is_active', true)->get(['id', 'name', 'code']),
        ]);
    }

    public function store(DocumentStoreRequest $request): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        $document = Document::create([
            'title' => $request->title,
            'document_type_id' => $request->document_type_id,
            'organisation_id' => $request->organisation_id,
            'document_no' => $request->document_no,
            'publish_status' => $request->publish_status,
            'published_by' => $request->publish_status === 'published' ? $request->user()->id : null,
            'published_by_id' => $request->publish_status === 'published' ? $request->user()->id : null,
            'published_at' => $request->publish_status === 'published' ? now() : null,
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('documents', 'public');

            DocumentRevision::create([
                'document_id' => $document->id,
                'revision_no' => 1,
                'revision_date' => $request->revision_date ?? now()->toDateString(),
                'doc_date' => $request->doc_date,
                'doc_month' => $request->doc_month,
                'doc_year' => $request->doc_year,
                'active' => true,
                'file_path' => $path,
                'uploaded_by' => $request->user()->id,
                'uploaded_by_id' => $request->user()->id,
                'uploaded_at' => now(),
            ]);
        }

        return redirect()->route('documents.index')->with('success', 'Document created successfully.');
    }

    public function show(Request $request, Document $document): Response
    {
        $this->authorizeAccess($request, 'document.view');

        return Inertia::render('documents/show', [
            'document' => $document->load([
                'documentType',
                'organization',
                'publishedBy',
                'archivedBy',
                'documentRevisions' => function ($q) {
                    $q->orderBy('revision_no', 'desc');
                },
                'documentRevisions.uploadedBy',
            ]),
        ]);
    }

    public function edit(Request $request, Document $document): Response
    {
        $this->authorizeAccess($request, 'document.manage');

        return Inertia::render('documents/edit', [
            'document' => $document,
            'documentTypes' => DocumentType::all(),
            'organizations' => Organization::where('is_active', true)->get(['id', 'name', 'code']),
        ]);
    }

    public function update(DocumentUpdateRequest $request, Document $document): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        $document->update($request->validated());

        return redirect()->route('documents.index')->with('success', 'Document updated successfully.');
    }

    public function destroy(Request $request, Document $document): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        // Delete all revision files
        foreach ($document->documentRevisions as $revision) {
            if (Storage::disk('public')->exists($revision->file_path)) {
                Storage::disk('public')->delete($revision->file_path);
            }
        }

        $document->delete();

        return redirect()->route('documents.index')->with('success', 'Document deleted successfully.');
    }

    public function publish(Request $request, Document $document): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        $document->update([
            'publish_status' => 'published',
            'published_by' => $request->user()->id,
            'published_by_id' => $request->user()->id,
            'published_at' => now(),
        ]);

        return back()->with('success', 'Document published successfully.');
    }

    public function archive(Request $request, Document $document): RedirectResponse
    {
        $this->authorizeAccess($request, 'document.manage');

        $document->update([
            'publish_status' => 'archived',
            'archived_by' => $request->user()->id,
            'archived_by_id' => $request->user()->id,
            'archived_at' => now(),
        ]);

        return back()->with('success', 'Document archived successfully.');
    }
}
