<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \App\Models\Borrower::observe(\App\Observers\BorrowerObserver::class);
        \App\Models\Loan::observe(\App\Observers\LoanObserver::class);
        \App\Models\Payment::observe(\App\Observers\PaymentObserver::class);

        \Illuminate\Auth\Notifications\ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url', 'http://localhost:5173')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
