<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockOpnameStoreRequest;
use App\Http\Requests\StockOpnameUpdateRequest;
use App\Models\StockOpname;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class StockOpnameController extends Controller
{
    public function index(Request $request): View
    {
        $stockOpnames = StockOpname::all();

        return view('stockOpname.index', [
            'stockOpnames' => $stockOpnames,
        ]);
    }

    public function create(Request $request): View
    {
        return view('stockOpname.create');
    }

    public function store(StockOpnameStoreRequest $request): RedirectResponse
    {
        $stockOpname = StockOpname::create($request->validated());

        $request->session()->flash('stockOpname.id', $stockOpname->id);

        return redirect()->route('stockOpnames.index');
    }

    public function show(Request $request, StockOpname $stockOpname): View
    {
        return view('stockOpname.show', [
            'stockOpname' => $stockOpname,
        ]);
    }

    public function edit(Request $request, StockOpname $stockOpname): View
    {
        return view('stockOpname.edit', [
            'stockOpname' => $stockOpname,
        ]);
    }

    public function update(StockOpnameUpdateRequest $request, StockOpname $stockOpname): RedirectResponse
    {
        $stockOpname->update($request->validated());

        $request->session()->flash('stockOpname.id', $stockOpname->id);

        return redirect()->route('stockOpnames.index');
    }

    public function destroy(Request $request, StockOpname $stockOpname): RedirectResponse
    {
        $stockOpname->delete();

        return redirect()->route('stockOpnames.index');
    }
}
