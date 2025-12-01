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
            ->with(['loans.payments'])
            ->withSum('loans', 'amount')
            ->latest()
            ->get();

        $borrowers->each(function ($borrower) {
            $borrower->total_outstanding = $borrower->loans->sum('balance');
            $borrower->active_loans_count = $borrower->loans->where('status', 'active')->count();
        });

        $borrowers->makeHidden('loans');

        return response()->json($borrowers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'id_type' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
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
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'id_type' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
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
