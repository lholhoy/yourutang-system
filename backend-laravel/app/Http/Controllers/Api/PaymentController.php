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

        $loan = Loan::findOrFail($validated['loan_id']);
        
        // Optional: Check if payment exceeds balance
        if ($validated['amount'] > $loan->balance) {
            // You might want to allow overpayment or return an error. 
            // For now, we'll allow it but maybe warn in frontend.
        }

        $payment = Payment::create($validated);

        return response()->json($payment, 201);
    }
}
