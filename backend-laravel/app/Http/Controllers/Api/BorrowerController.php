<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BorrowerController extends Controller
{
    public function index()
    {
        $borrowers = Borrower::where('user_id', Auth::id())
            ->withSum('loans', 'amount')
            ->latest()
            ->get();

        return response()->json($borrowers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $borrower = Auth::user()->borrowers()->create($validated);

        return response()->json($borrower, 201);
    }

    public function show($id)
    {
        $borrower = Borrower::where('user_id', Auth::id())
            ->with('loans')
            ->withSum('loans', 'amount')
            ->findOrFail($id);

        return response()->json($borrower);
    }

    public function update(Request $request, $id)
    {
        $borrower = Borrower::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $borrower->update($validated);

        return response()->json($borrower);
    }

    public function destroy($id)
    {
        $borrower = Borrower::where('user_id', Auth::id())->findOrFail($id);
        $borrower->delete();

        return response()->json(['message' => 'Borrower deleted successfully']);
    }
}
