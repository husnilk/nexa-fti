<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssetStoreRequest;
use App\Http\Requests\AssetUpdateRequest;
use App\Models\Asset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AssetController extends Controller
{
    public function index(Request $request): View
    {
        $assets = Asset::all();

        return view('asset.index', [
            'assets' => $assets,
        ]);
    }

    public function create(Request $request): View
    {
        return view('asset.create');
    }

    public function store(AssetStoreRequest $request): RedirectResponse
    {
        $asset = Asset::create($request->validated());

        $request->session()->flash('asset.id', $asset->id);

        return redirect()->route('assets.index');
    }

    public function show(Request $request, Asset $asset): View
    {
        return view('asset.show', [
            'asset' => $asset,
        ]);
    }

    public function edit(Request $request, Asset $asset): View
    {
        return view('asset.edit', [
            'asset' => $asset,
        ]);
    }

    public function update(AssetUpdateRequest $request, Asset $asset): RedirectResponse
    {
        $asset->update($request->validated());

        $request->session()->flash('asset.id', $asset->id);

        return redirect()->route('assets.index');
    }

    public function destroy(Request $request, Asset $asset): RedirectResponse
    {
        $asset->delete();

        return redirect()->route('assets.index');
    }
}
