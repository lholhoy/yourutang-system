<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Loan $loan)
    {
        // Verify loan belongs to user
        if ($loan->borrower->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return $loan->payments()->orderBy('payment_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Verify loan belongs to user
        $loan = Loan::whereHas('borrower', function ($q) {
            $q->where('user_id', auth()->id());
        })->findOrFail($validated['loan_id']);
        
        // Optional: Check if payment exceeds balance
        if ($validated['amount'] > $loan->balance) {
            // You might want to allow overpayment or return an error. 
            // For now, we'll allow it but maybe warn in frontend.
        }

        $payment = $loan->payments()->create($validated);

        return response()->json($payment, 201);
    }
}
