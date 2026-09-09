<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssetGrantStoreRequest;
use App\Http\Requests\AssetGrantUpdateRequest;
use App\Models\AssetGrant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AssetGrantController extends Controller
{
    public function index(Request $request): View
    {
        $assetGrants = AssetGrant::all();

        return view('assetGrant.index', [
            'assetGrants' => $assetGrants,
        ]);
    }

    public function create(Request $request): View
    {
        return view('assetGrant.create');
    }

    public function store(AssetGrantStoreRequest $request): RedirectResponse
    {
        $assetGrant = AssetGrant::create($request->validated());

        $request->session()->flash('assetGrant.id', $assetGrant->id);

        return redirect()->route('assetGrants.index');
    }

    public function show(Request $request, AssetGrant $assetGrant): View
    {
        return view('assetGrant.show', [
            'assetGrant' => $assetGrant,
        ]);
    }

    public function edit(Request $request, AssetGrant $assetGrant): View
    {
        return view('assetGrant.edit', [
            'assetGrant' => $assetGrant,
        ]);
    }

    public function update(AssetGrantUpdateRequest $request, AssetGrant $assetGrant): RedirectResponse
    {
        $assetGrant->update($request->validated());

        $request->session()->flash('assetGrant.id', $assetGrant->id);

        return redirect()->route('assetGrants.index');
    }

    public function destroy(Request $request, AssetGrant $assetGrant): RedirectResponse
    {
        $assetGrant->delete();

        return redirect()->route('assetGrants.index');
    }
}
