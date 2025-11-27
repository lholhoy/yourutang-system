<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $totalBorrowers = Borrower::where('user_id', $userId)->count();
        $totalLoans = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId))->count();
        $totalOutstanding = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId))->sum('amount') -
            \App\Models\Payment::whereHas('loan.borrower', fn($q) => $q->where('user_id', $userId))->sum('amount');

        $monthlyLoans = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId))
            ->selectRaw('SUM(amount) as total, DATE_FORMAT(date_borrowed, "%Y-%m") as month')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $topBorrowers = Borrower::where('user_id', $userId)
            ->withSum('loans', 'amount')
            ->orderByDesc('loans_sum_amount')
            ->take(5)
            ->get();

        return response()->json([
            'total_borrowers' => $totalBorrowers,
            'total_loans' => $totalLoans,
            'total_outstanding' => $totalOutstanding,
            'monthly_loans' => $monthlyLoans,
            'top_borrowers' => $topBorrowers,
        ]);
    }
}
