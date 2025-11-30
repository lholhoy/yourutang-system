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

        $filter = $request->query('filter', 'this_year');
        $query = Loan::whereHas('borrower', fn($q) => $q->where('user_id', $userId));

        $monthlyLoans = [];
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

            $data = $query->whereYear('date_borrowed', date('Y'))
                  ->whereMonth('date_borrowed', date('m'))
                  ->selectRaw('SUM(amount) as total, DATE_FORMAT(date_borrowed, "%Y-%m-%d") as label')
                  ->groupBy(DB::raw('DATE_FORMAT(date_borrowed, "%Y-%m-%d")'))
                  ->pluck('total', 'label');
            
        } elseif ($filter === 'last_year') {
            // Show monthly data for last year
            $lastYear = date('Y') - 1;
            for ($i = 1; $i <= 12; $i++) {
                $month = str_pad($i, 2, '0', STR_PAD_LEFT);
                $months[$lastYear . '-' . $month] = 0;
            }

            $data = $query->whereYear('date_borrowed', $lastYear)
                ->selectRaw('SUM(amount) as total, DATE_FORMAT(date_borrowed, "%Y-%m") as label')
                ->groupBy(DB::raw('DATE_FORMAT(date_borrowed, "%Y-%m")'))
                ->pluck('total', 'label');

        } else {
            // Default: this_year
            // Show monthly data for this year
            $thisYear = date('Y');
            for ($i = 1; $i <= 12; $i++) {
                $month = str_pad($i, 2, '0', STR_PAD_LEFT);
                $months[$thisYear . '-' . $month] = 0;
            }

            $data = $query->whereYear('date_borrowed', $thisYear)
                ->selectRaw('SUM(amount) as total, DATE_FORMAT(date_borrowed, "%Y-%m") as label')
                ->groupBy(DB::raw('DATE_FORMAT(date_borrowed, "%Y-%m")'))
                ->pluck('total', 'label');
        }

        // Merge data
        foreach ($months as $label => $value) {
            $monthlyLoans[] = [
                'label' => $label,
                'total' => isset($data[$label]) ? (float)$data[$label] : 0
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
            'monthly_loans' => $monthlyLoans,
            'top_borrowers' => $topBorrowers,
        ]);
    }
}
