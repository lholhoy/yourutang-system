<?php

namespace App\Observers;

use App\Models\Payment;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class PaymentObserver
{
    public function created(Payment $payment): void
    {
        $borrowerName = $payment->loan->borrower->name;
        ActivityLog::create([
            'user_id' => Auth::id(),
            'description' => "received payment of ₱" . number_format($payment->amount, 2) . " from {$borrowerName}",
            'subject_type' => Payment::class,
            'subject_id' => $payment->id,
            'properties' => $payment->toArray(),
        ]);
    }
}
