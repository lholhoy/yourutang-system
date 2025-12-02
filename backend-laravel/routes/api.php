<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\BorrowerController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Profile
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);

    // Core Features
    Route::apiResource('borrowers', BorrowerController::class);
    Route::get('/loans/upcoming-due', [LoanController::class, 'getUpcomingDue']);
    Route::apiResource('loans', LoanController::class);
    Route::post('/loans/{id}/remind', [LoanController::class, 'sendReminder']);
    
    // Payments
    Route::get('/loans/{loan}/payments', [App\Http\Controllers\Api\PaymentController::class, 'index']);
    Route::post('/payments', [App\Http\Controllers\Api\PaymentController::class, 'store']);

    // Analytics
    Route::get('/analytics', [AnalyticsController::class, 'index']);
    
    // Export
    Route::get('/export/borrowers', [App\Http\Controllers\Api\ExportController::class, 'exportBorrowers']);
    Route::get('/export/statement/{borrower}', [App\Http\Controllers\Api\ExportController::class, 'generateStatement']);
    Route::get('/export/contract/{loan}', [App\Http\Controllers\Api\ExportController::class, 'generateContract']);
    
    // History
    Route::get('/history', [App\Http\Controllers\Api\HistoryLogController::class, 'index']);
    Route::get('/activity-logs', [App\Http\Controllers\Api\ActivityLogController::class, 'index']);
});

require __DIR__.'/auth.php';


