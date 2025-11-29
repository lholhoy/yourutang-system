<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Loan;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoanDueReminder;

class SendLoanReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'loans:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders for loans due today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for loans due today...');

        $loans = Loan::whereDate('due_date', now())
                     ->with('borrower')
                     ->withSum('payments', 'amount')
                     ->get();

        $count = 0;

        foreach ($loans as $loan) {
            $balance = $loan->amount - ($loan->payments_sum_amount ?? 0);

            if ($balance > 0) {
                if ($loan->borrower && $loan->borrower->email) {
                    try {
                        Mail::to($loan->borrower->email)->send(new LoanDueReminder($loan));
                        $this->info("Reminder sent to {$loan->borrower->email} for Loan #{$loan->id}");
                        $count++;
                    } catch (\Exception $e) {
                        $this->error("Failed to send reminder for Loan #{$loan->id}: " . $e->getMessage());
                    }
                } else {
                    $this->warn("Loan #{$loan->id} is due but borrower has no email.");
                }
            }
        }

        $this->info("Sent {$count} reminders.");
    }
}
