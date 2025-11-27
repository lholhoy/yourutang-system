<?php

namespace App\Observers;

use App\Models\Borrower;
use App\Models\HistoryLog;
use Illuminate\Support\Facades\Auth;

class BorrowerObserver
{
    public function created(Borrower $borrower): void
    {
        HistoryLog::create([
            'user_id' => Auth::id(),
            'action' => 'Created Borrower',
            'description' => "Added new borrower: {$borrower->name}",
            'subject_type' => Borrower::class,
            'subject_id' => $borrower->id,
        ]);
    }

    public function updated(Borrower $borrower): void
    {
        HistoryLog::create([
            'user_id' => Auth::id(),
            'action' => 'Updated Borrower',
            'description' => "Updated borrower details: {$borrower->name}",
            'subject_type' => Borrower::class,
            'subject_id' => $borrower->id,
        ]);
    }

    public function deleted(Borrower $borrower): void
    {
        HistoryLog::create([
            'user_id' => Auth::id(),
            'action' => 'Deleted Borrower',
            'description' => "Deleted borrower: {$borrower->name}",
            'subject_type' => Borrower::class,
            'subject_id' => $borrower->id,
        ]);
    }
}
