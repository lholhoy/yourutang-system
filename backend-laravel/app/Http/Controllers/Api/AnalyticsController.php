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
    public function index(Request $request)
    {
        $userId = Auth::id();

        $totalBorrowers = Borrower::where('user_id', $userId)->count();
        $totalLoans = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId))->count();
        $totalOutstanding = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId))->sum('amount') -
            \App\Models\Payment::whereHas('loan.borrower', fn($q) => $q->where('user_id', $userId))->sum('amount');

        // Calculate Total Interest (Earnings)
        // We need to iterate all loans to calculate interest based on their specific terms
        $allLoans = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId))->get();
        $totalInterest = 0;
        
        foreach ($allLoans as $loan) {
            $termInMonths = $loan->term_months;
            if ($loan->term_unit === 'weeks') {
                $termInMonths = $loan->term_months / 4;
            }
            $interest = $loan->amount * ($loan->interest_rate / 100) * $termInMonths;
            $totalInterest += $interest;
        }

        $filter = $request->query('filter', 'this_year');
        $query = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId));

        // Fetch loans for the period to calculate both Principal and Interest
        $loans = $query->get();

        $months = [];
        
        if ($filter === 'this_month') {
            // Show daily data for this month
            $daysInMonth = date('t');
            $currentMonth = date('Y-m');
            
            // Initialize all days with 0
            for ($i = 1; $i <= $daysInMonth; $i++) {
                $day = str_pad($i, 2, '0', STR_PAD_LEFT);
                $months[$currentMonth . '-' . $day] = 0;
            }
        } elseif ($filter === 'last_year') {
            // Show monthly data for last year
            $lastYear = date('Y') - 1;
            for ($i = 1; $i <= 12; $i++) {
                $month = str_pad($i, 2, '0', STR_PAD_LEFT);
                $months[$lastYear . '-' . $month] = 0;
            }
        } else {
            // Default: this_year
            // Show monthly data for this year
            $thisYear = date('Y');
            for ($i = 1; $i <= 12; $i++) {
                $month = str_pad($i, 2, '0', STR_PAD_LEFT);
                $months[$thisYear . '-' . $month] = 0;
            }
        }
        
        // Initialize arrays
        $loanData = [];
        $interestData = [];
        
        foreach ($months as $key => $val) {
            $loanData[$key] = 0;
            $interestData[$key] = 0;
        }

        foreach ($loans as $loan) {
            // Determine the key (Day or Month) based on filter
            $date = \Carbon\Carbon::parse($loan->date_borrowed);
            
            if ($filter === 'this_month') {
                // Key format: YYYY-MM-DD
                // Only include if it matches the current month/year (already filtered by query, but good to be safe)
                $key = $date->format('Y-m-d');
            } else {
                // Key format: YYYY-MM
                $key = $date->format('Y-m');
            }

            if (isset($loanData[$key])) {
                // Principal
                $loanData[$key] += $loan->amount;

                // Interest Calculation
                // Interest = Principal * (Rate/100) * Term (in months)
                // If term_unit is weeks, convert to months (approx / 4)
                $termInMonths = $loan->term_months;
                if ($loan->term_unit === 'weeks') {
                    $termInMonths = $loan->term_months / 4;
                }
                
                $interest = $loan->amount * ($loan->interest_rate / 100) * $termInMonths;
                $interestData[$key] += $interest;
            }
        }

        // Format for Chart.js
        $monthlyLoans = [];
        $monthlyInterests = [];

        foreach ($months as $label => $value) {
            $monthlyLoans[] = [
                'label' => $label,
                'total' => $loanData[$label]
            ];
            $monthlyInterests[] = [
                'label' => $label,
                'total' => $interestData[$label]
            ];
        }

        $topBorrowers = Borrower::where('user_id', $userId)
            ->withSum('loans', 'amount')
            ->orderByDesc('loans_sum_amount')
            ->take(5)
            ->get();

        return response()->json([
            'total_borrowers' => $totalBorrowers,
            'total_loans' => $totalLoans,
            'total_outstanding' => $totalOutstanding,
            'total_interest' => $totalInterest,
            'monthly_loans' => $monthlyLoans,
            'monthly_interests' => $monthlyInterests,
            'top_borrowers' => $topBorrowers,
        ]);
    }
}
