<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'borrower_id',
        'amount',
        'date_borrowed',
        'description',
        'interest_rate',
        'interest_type',
        'term_months',
        'term_unit',
        'due_date',
    ];

    protected $appends = ['balance', 'status'];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getBalanceAttribute()
    {
        return $this->amount - $this->payments()->sum('amount');
    }

    public function getStatusAttribute()
    {
        return $this->balance <= 0 ? 'paid' : 'active';
    }

    /**
     * Calculate amortization schedule (Flat Rate)
     */
    public function getAmortizationSchedule()
    {
        $schedule = [];
        $balance = $this->amount;
        $term = $this->term_months;
        $unit = $this->term_unit ?? 'months';

        if ($term <= 0) return [];

        // Rate Calculation
        // If unit is weeks, we assume the interest rate is still per month (standard) or per week?
        // For simplicity in this iteration, let's assume the rate provided is "per term unit" or stick to monthly.
        // Usually rates are monthly. 
        // If rate is 5% monthly, and term is 4 weeks (approx 1 month), interest is 5%.
        // Let's keep it simple: Rate is applied based on the term duration relative to a month.
        
        // Actually, usually "Interest Rate" is Monthly.
        // Weekly Rate = Monthly Rate / 4.
        
        $monthlyRate = $this->interest_rate / 100;
        
        if ($unit === 'weeks') {
            $ratePerPeriod = $monthlyRate / 4; // Approx weekly rate
            $dateAdder = 'addWeeks';
        } else {
            $ratePerPeriod = $monthlyRate;
            $dateAdder = 'addMonths';
        }

        // Flat Rate Calculation
        $principalPerPeriod = $this->amount / $term;
        $interestPerPeriod = $this->amount * $ratePerPeriod;
        $paymentPerPeriod = $principalPerPeriod + $interestPerPeriod;

        $startDate = \Carbon\Carbon::parse($this->date_borrowed);

        for ($i = 1; $i <= $term; $i++) {
            $balance -= $principalPerPeriod;
            $schedule[] = [
                'payment_no' => $i,
                'date' => $startDate->copy()->$dateAdder($i)->format('Y-m-d'),
                'amount' => round($paymentPerPeriod, 2),
                'principal' => round($principalPerPeriod, 2),
                'interest' => round($interestPerPeriod, 2),
                'balance' => max(0, round($balance, 2)),
            ];
        }

        return $schedule;
    }
}
