<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicationStoreRequest;
use App\Http\Requests\PublicationUpdateRequest;
use App\Models\ConferenceProceeding;
use App\Models\JournalPublication;
use App\Models\Publication;
use App\Models\Research;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PublicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:publication.view')->only(['index', 'show']);
        $this->middleware('permission:publication.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    public function index(Request $request): Response
    {
        $publications = Publication::with(['journalPublication', 'conferenceProceeding'])
            ->withCount('publicationAuthors')
            ->get()
            ->map(function ($publication) {
                $type = $publication->journalPublication ? 'journal' : ($publication->conferenceProceeding ? 'conference' : 'unknown');
                $publication->type = $type;

                return $publication;
            });

        $researchProjects = Research::all(['id', 'title']);

        return Inertia::render('publications/index', [
            'publications' => $publications,
            'researchProjects' => $researchProjects,
        ]);
    }

    public function store(PublicationStoreRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $validated = $request->validated();

            $publication = Publication::create([
                'title' => $validated['title'],
                'publication_date' => $validated['publication_date'],
                'doi' => $validated['doi'] ?? null,
                'url' => $validated['url'] ?? null,
                'abstract' => $validated['abstract'] ?? null,
                'research_id' => $validated['research_id'] ?? null,
            ]);

            if ($validated['type'] === 'journal') {
                JournalPublication::create([
                    'id' => $publication->id,
                    'journal_name' => $validated['journal_name'],
                    'issn' => $validated['issn'] ?? null,
                    'publisher' => $validated['publisher'] ?? null,
                    'volume' => $validated['volume'] ?? null,
                    'issue' => $validated['issue'] ?? null,
                    'pages' => $validated['pages'] ?? null,
                    'indexing' => $validated['indexing'] ?? null,
                    'quartile' => $validated['quartile'] ?? null,
                ]);
            } elseif ($validated['type'] === 'conference') {
                ConferenceProceeding::create([
                    'id' => $publication->id,
                    'conference_name' => $validated['conference_name'],
                    'conference_location' => $validated['conference_location'] ?? null,
                    'conference_date' => $validated['conference_date'] ?? null,
                    'publisher' => $validated['publisher'] ?? null,
                    'isbn' => $validated['isbn'] ?? null,
                    'pages' => $validated['pages'] ?? null,
                    'indexing' => $validated['indexing'] ?? null,
                ]);
            }
        });

        return redirect()->route('publications.index')->with('success', 'Publication created successfully.');
    }

    public function show(Request $request, Publication $publication): Response
    {
        $publication->load(['journalPublication', 'conferenceProceeding', 'publicationAuthors.author', 'research']);
        $type = $publication->journalPublication ? 'journal' : ($publication->conferenceProceeding ? 'conference' : 'unknown');
        $publication->type = $type;

        $users = User::all(['id', 'name']);

        return Inertia::render('publications/show', [
            'publication' => $publication,
            'users' => $users,
        ]);
    }

    public function update(PublicationUpdateRequest $request, Publication $publication): RedirectResponse
    {
        DB::transaction(function () use ($request, $publication) {
            $validated = $request->validated();

            $publication->update([
                'title' => $validated['title'],
                'publication_date' => $validated['publication_date'],
                'doi' => $validated['doi'] ?? null,
                'url' => $validated['url'] ?? null,
                'abstract' => $validated['abstract'] ?? null,
                'research_id' => $validated['research_id'] ?? null,
            ]);

            if ($validated['type'] === 'journal') {
                if ($publication->conferenceProceeding) {
                    $publication->conferenceProceeding()->delete();
                }
                $journalData = [
                    'journal_name' => $validated['journal_name'],
                    'issn' => $validated['issn'] ?? null,
                    'publisher' => $validated['publisher'] ?? null,
                    'volume' => $validated['volume'] ?? null,
                    'issue' => $validated['issue'] ?? null,
                    'pages' => $validated['pages'] ?? null,
                    'indexing' => $validated['indexing'] ?? null,
                    'quartile' => $validated['quartile'] ?? null,
                ];
                if ($publication->journalPublication) {
                    $publication->journalPublication->update($journalData);
                } else {
                    JournalPublication::create(array_merge(['id' => $publication->id], $journalData));
                }
            } elseif ($validated['type'] === 'conference') {
                if ($publication->journalPublication) {
                    $publication->journalPublication()->delete();
                }
                $conferenceData = [
                    'conference_name' => $validated['conference_name'],
                    'conference_location' => $validated['conference_location'] ?? null,
                    'conference_date' => $validated['conference_date'] ?? null,
                    'publisher' => $validated['publisher'] ?? null,
                    'isbn' => $validated['isbn'] ?? null,
                    'pages' => $validated['pages'] ?? null,
                    'indexing' => $validated['indexing'] ?? null,
                ];
                if ($publication->conferenceProceeding) {
                    $publication->conferenceProceeding->update($conferenceData);
                } else {
                    ConferenceProceeding::create(array_merge(['id' => $publication->id], $conferenceData));
                }
            }
        });

        return redirect()->route('publications.index')->with('success', 'Publication updated successfully.');
    }

    public function destroy(Request $request, Publication $publication): RedirectResponse
    {
        $publication->delete();

        return redirect()->route('publications.index')->with('success', 'Publication deleted successfully.');
    }
}
