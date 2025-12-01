<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Borrower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $query = Loan::whereHas('borrower', function ($q) {
            $q->where('user_id', Auth::id());
        });

        if ($request->has('borrower_id')) {
            $query->where('borrower_id', $request->borrower_id);
        }

        if ($request->has('status')) {
            $status = $request->status;
            if ($status === 'paid') {
                $query->whereRaw('(amount - (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payments.loan_id = loans.id)) <= 0');
            } elseif ($status === 'active') {
                $query->whereRaw('(amount - (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payments.loan_id = loans.id)) > 0');
            }
        }

        $loans = $query->with('borrower')->latest()->get();

        return response()->json($loans);
    }

    public function getUpcomingDue()
    {
        $loans = Loan::whereHas('borrower', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->with('borrower')
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(7))
            ->get()
            ->filter(function ($loan) {
                return $loan->balance > 0;
            })
            ->values();

        return response()->json($loans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'borrower_id' => 'required|exists:borrowers,id',
            'amount' => 'required|numeric|min:0.01',
            'date_borrowed' => 'required|date',
            'description' => 'nullable|string',
            'interest_rate' => 'nullable|numeric|min:0',
            'interest_type' => 'nullable|in:monthly,daily',
            'term_months' => 'nullable|integer|min:1',
            'term_unit' => 'nullable|in:months,weeks',
            'due_date' => 'nullable|date|after_or_equal:date_borrowed',
        ]);

        // Verify borrower belongs to user
        $borrower = Borrower::where('user_id', Auth::id())->findOrFail($validated['borrower_id']);

        // Calculate due date if term is provided AND due_date is missing
        if (empty($validated['due_date']) && !empty($validated['term_months']) && !empty($validated['date_borrowed'])) {
            $unit = $validated['term_unit'] ?? 'months';
            $date = \Carbon\Carbon::parse($validated['date_borrowed']);
            
            if ($unit === 'weeks') {
                $validated['due_date'] = $date->addWeeks($validated['term_months']);
            } else {
                $validated['due_date'] = $date->addMonths($validated['term_months']);
            }
        }

        $loan = $borrower->loans()->create($validated);

        return response()->json($loan, 201);
    }

    public function show($id)
    {
        $loan = Loan::whereHas('borrower', function ($q) {
            $q->where('user_id', Auth::id());
        })->with('borrower')->findOrFail($id);

        return response()->json($loan);
    }

    public function update(Request $request, $id)
    {
        $loan = Loan::whereHas('borrower', function ($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        $validated = $request->validate([
            'amount' => 'numeric|min:0.01',
            'date_borrowed' => 'date',
            'description' => 'nullable|string',
            'interest_rate' => 'nullable|numeric|min:0',
            'interest_type' => 'nullable|in:monthly,daily',
            'term_months' => 'nullable|integer|min:1',
            'term_unit' => 'nullable|in:months,weeks',
            'due_date' => 'nullable|date|after_or_equal:date_borrowed',
        ]);

        // Recalculate due date if term or date changed AND due_date is NOT explicitly provided in this update
        if (!isset($validated['due_date']) && (isset($validated['term_months']) || isset($validated['date_borrowed']) || isset($validated['term_unit']))) {
            $term = $validated['term_months'] ?? $loan->term_months;
            $unit = $validated['term_unit'] ?? $loan->term_unit ?? 'months';
            $date = $validated['date_borrowed'] ?? $loan->date_borrowed;
            
            if ($term && $date) {
                $parsedDate = \Carbon\Carbon::parse($date);
                if ($unit === 'weeks') {
                    $validated['due_date'] = $parsedDate->addWeeks($term);
                } else {
                    $validated['due_date'] = $parsedDate->addMonths($term);
                }
            }
        }

        $loan->update($validated);

        return response()->json($loan);
    }

    public function destroy($id)
    {
        $loan = Loan::whereHas('borrower', function ($q) {
            $q->where('user_id', Auth::id());
        })->findOrFail($id);

        $loan->delete();

        return response()->json(['message' => 'Loan deleted successfully']);
    }

    public function sendReminder($id)
    {
        $loan = Loan::whereHas('borrower', function ($q) {
            $q->where('user_id', Auth::id());
        })->with('borrower')->findOrFail($id);

        if (!$loan->borrower->email) {
            return response()->json(['message' => 'Borrower has no email address'], 422);
        }

        try {
            \Illuminate\Support\Facades\Mail::to($loan->borrower->email)->send(new \App\Mail\LoanDueReminder($loan));
            return response()->json(['message' => 'Reminder sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }
}
