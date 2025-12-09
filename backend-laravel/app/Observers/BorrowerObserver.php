<?php

namespace App\Observers;

use App\Models\Borrower;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class BorrowerObserver
{
    public function created(Borrower $borrower): void
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'description' => "added a new borrower: {$borrower->name}",
            'subject_type' => Borrower::class,
            'subject_id' => $borrower->id,
            'properties' => $borrower->toArray(),
        ]);
    }

    public function updated(Borrower $borrower): void
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'description' => "updated borrower details: {$borrower->name}",
            'subject_type' => Borrower::class,
            'subject_id' => $borrower->id,
            'properties' => $borrower->getDirty(),
        ]);
    }

    public function deleted(Borrower $borrower): void
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'description' => "deleted borrower: {$borrower->name}",
            'subject_type' => Borrower::class,
            'subject_id' => $borrower->id,
        ]);
    }
}
