<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use App\Models\Loan;
use Illuminate\Http\Response;

class ExportController extends Controller
{
    public function exportBorrowers()
    {
        $borrowers = Borrower::where('user_id', \Illuminate\Support\Facades\Auth::id())
            ->with(['loans.payments'])
            ->get();
        
        $csvFileName = 'borrowers_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($borrowers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'ID', 
                'Name', 
                'Contact', 
                'Notes', 
                'Total Borrowed', 
                'Total Paid', 
                'Outstanding Balance', 
                'Active Loans Count', 
                'Status'
            ]);

            foreach ($borrowers as $borrower) {
                $totalBorrowed = $borrower->loans->sum('amount');
                $totalPaid = $borrower->loans->flatMap->payments->sum('amount');
                $outstanding = $totalBorrowed - $totalPaid;
                
                // Count loans that are not fully paid
                $activeLoans = $borrower->loans->filter(function($loan) {
                    return ($loan->amount - $loan->payments->sum('amount')) > 0;
                })->count();

                $status = $outstanding > 0 ? 'Active' : 'Paid';

                fputcsv($file, [
                    $borrower->id,
                    $borrower->name,
                    "\t" . $borrower->contact, // Force text format for Excel
                    $borrower->notes,
                    $totalBorrowed,
                    $totalPaid,
                    $outstanding,
                    $activeLoans,
                    $status
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportLoans()
    {
        $loans = Loan::with('borrower')->get();
        $csv = "ID,Borrower,Amount,Balance,Status,Date Borrowed\n";

        foreach ($loans as $loan) {
            $csv .= "{$loan->id},\"{$loan->borrower->name}\",{$loan->amount},{$loan->balance},{$loan->status},{$loan->date_borrowed}\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="loans.csv"');
    }

    public function generateStatement(\App\Models\Borrower $borrower)
    {
        $borrower->load(['loans.payments']);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.statement', compact('borrower'));
        
        return $pdf->download("statement_{$borrower->id}_{$borrower->name}.pdf");
    }

    public function generateContract(\App\Models\Loan $loan)
    {
        $loan->load(['borrower.user']);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.contract', compact('loan'));
        
        return $pdf->download("contract_{$loan->id}_{$loan->borrower->name}.pdf");
    }
}
