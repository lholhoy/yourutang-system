<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            if (!Schema::hasColumn('loans', 'interest_rate')) {
                $table->decimal('interest_rate', 5, 2)->default(0)->after('amount');
            }
            if (!Schema::hasColumn('loans', 'term_months')) {
                $table->integer('term_months')->nullable()->after('interest_rate');
            }
            if (!Schema::hasColumn('loans', 'due_date')) {
                $table->date('due_date')->nullable()->after('date_borrowed');
            }
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn(['interest_rate', 'term_months', 'due_date']);
        });
    }
};
