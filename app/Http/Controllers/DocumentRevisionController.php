<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentRevisionStoreRequest;
use App\Http\Requests\DocumentRevisionUpdateRequest;
use App\Models\Document;
use App\Models\DocumentRevision;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DocumentRevisionController extends Controller
{
    /**
     * Authorize user access for document management.
     */
    protected function authorizeAccess(Request $request): void
    {
        if (! $request->user()->can('document.manage') && ! $request->user()->hasRole('super-admin')) {
            abort(403, 'Unauthorized. Only users with document.manage permission can manage documents.');
        }
    }

    public function store(DocumentRevisionStoreRequest $request): RedirectResponse
    {
        $this->authorizeAccess($request);

        DB::transaction(function () use ($request) {
            // Deactivate all previous revisions
            DocumentRevision::where('document_id', $request->document_id)
                ->update(['active' => false]);

            // Get next revision number
            $latestRevision = DocumentRevision::where('document_id', $request->document_id)
                ->orderBy('revision_no', 'desc')
                ->first();
            $nextRevisionNo = $latestRevision ? $latestRevision->revision_no + 1 : 1;

            // Save the uploaded file
            $path = $request->file('file')->store('documents', 'public');

            // Create new revision
            DocumentRevision::create([
                'document_id' => $request->document_id,
                'revision_no' => $nextRevisionNo,
                'revision_date' => $request->revision_date,
                'doc_date' => $request->doc_date,
                'doc_month' => $request->doc_month,
                'doc_year' => $request->doc_year,
                'active' => true,
                'file_path' => $path,
                'uploaded_by' => $request->user()->id,
                'uploaded_by_id' => $request->user()->id,
                'uploaded_at' => now(),
            ]);
        });

        return back()->with('success', 'Document revision uploaded successfully.');
    }

    public function update(DocumentRevisionUpdateRequest $request, DocumentRevision $documentRevision): RedirectResponse
    {
        $this->authorizeAccess($request);

        $data = $request->validated();

        if ($request->hasFile('file')) {
            // Delete old file
            if (Storage::disk('public')->exists($documentRevision->file_path)) {
                Storage::disk('public')->delete($documentRevision->file_path);
            }
            $data['file_path'] = $request->file('file')->store('documents', 'public');
        }

        $documentRevision->update($data);

        return back()->with('success', 'Document revision updated successfully.');
    }

    public function destroy(Request $request, DocumentRevision $documentRevision): RedirectResponse
    {
        $this->authorizeAccess($request);

        $documentId = $documentRevision->document_id;
        $wasActive = $documentRevision->active;

        DB::transaction(function () use ($documentRevision, $wasActive, $documentId) {
            // Delete the file from storage
            if (Storage::disk('public')->exists($documentRevision->file_path)) {
                Storage::disk('public')->delete($documentRevision->file_path);
            }

            // Delete the revision
            $documentRevision->delete();

            // If we deleted the active revision, activate the latest remaining revision
            if ($wasActive) {
                $latestRemaining = DocumentRevision::where('document_id', $documentId)
                    ->orderBy('revision_no', 'desc')
                    ->first();
                if ($latestRemaining) {
                    $latestRemaining->update(['active' => true]);
                }
            }
        });

        return back()->with('success', 'Document revision deleted successfully.');
    }
}
