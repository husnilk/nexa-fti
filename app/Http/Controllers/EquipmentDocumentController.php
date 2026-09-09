<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentDocumentStoreRequest;
use App\Http\Requests\EquipmentDocumentUpdateRequest;
use App\Models\EquipmentDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EquipmentDocumentController extends Controller
{
    public function index(Request $request): View
    {
        $equipmentDocuments = EquipmentDocument::all();

        return view('equipmentDocument.index', [
            'equipmentDocuments' => $equipmentDocuments,
        ]);
    }

    public function create(Request $request): View
    {
        return view('equipmentDocument.create');
    }

    public function store(EquipmentDocumentStoreRequest $request): RedirectResponse
    {
        $equipmentDocument = EquipmentDocument::create($request->validated());

        $request->session()->flash('equipmentDocument.id', $equipmentDocument->id);

        return redirect()->route('equipmentDocuments.index');
    }

    public function show(Request $request, EquipmentDocument $equipmentDocument): View
    {
        return view('equipmentDocument.show', [
            'equipmentDocument' => $equipmentDocument,
        ]);
    }

    public function edit(Request $request, EquipmentDocument $equipmentDocument): View
    {
        return view('equipmentDocument.edit', [
            'equipmentDocument' => $equipmentDocument,
        ]);
    }

    public function update(EquipmentDocumentUpdateRequest $request, EquipmentDocument $equipmentDocument): RedirectResponse
    {
        $equipmentDocument->update($request->validated());

        $request->session()->flash('equipmentDocument.id', $equipmentDocument->id);

        return redirect()->route('equipmentDocuments.index');
    }

    public function destroy(Request $request, EquipmentDocument $equipmentDocument): RedirectResponse
    {
        $equipmentDocument->delete();

        return redirect()->route('equipmentDocuments.index');
    }
}
