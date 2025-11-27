<?php

namespace App\Observers;

use App\Models\Loan;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class LoanObserver
{
    public function created(Loan $loan): void
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'description' => "created a new loan for {$loan->borrower->name} (₱" . number_format($loan->amount, 2) . ")",
            'subject_type' => Loan::class,
            'subject_id' => $loan->id,
            'properties' => $loan->toArray(),
        ]);
    }

    public function updated(Loan $loan): void
    {
        if ($loan->isDirty('status') && $loan->status === 'paid') {
            ActivityLog::create([
                'user_id' => Auth::id(),
                'description' => "marked loan #{$loan->id} as fully paid",
                'subject_type' => Loan::class,
                'subject_id' => $loan->id,
            ]);
        }
    }

    public function deleted(Loan $loan): void
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'description' => "deleted loan #{$loan->id}",
            'subject_type' => Loan::class,
            'subject_id' => $loan->id,
        ]);
    }
}
