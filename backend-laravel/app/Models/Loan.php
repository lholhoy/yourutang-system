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
        $rate = $this->interest_rate / 100; // Monthly rate
        $term = $this->term_months;

        if ($term <= 0) return [];

        // Flat Rate Calculation
        $monthlyPrincipal = $this->amount / $term;
        $monthlyInterest = $this->amount * $rate;
        $monthlyPayment = $monthlyPrincipal + $monthlyInterest;

        $startDate = \Carbon\Carbon::parse($this->date_borrowed);

        for ($i = 1; $i <= $term; $i++) {
            $balance -= $monthlyPrincipal;
            $schedule[] = [
                'payment_no' => $i,
                'date' => $startDate->copy()->addMonths($i)->format('Y-m-d'),
                'amount' => round($monthlyPayment, 2),
                'principal' => round($monthlyPrincipal, 2),
                'interest' => round($monthlyInterest, 2),
                'balance' => max(0, round($balance, 2)),
            ];
        }

        return $schedule;
    }
}
