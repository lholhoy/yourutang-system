<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'profile_image')) {
                $table->string('profile_image')->nullable()->after('email');
            }
        });

        Schema::table('loans', function (Blueprint $table) {
            if (!Schema::hasColumn('loans', 'interest_type')) {
                $table->string('interest_type')->default('monthly')->after('interest_rate');
            }
            if (!Schema::hasColumn('loans', 'due_date')) {
                $table->date('due_date')->nullable()->after('term_months');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'profile_image')) {
                $table->dropColumn('profile_image');
            }
        });

        Schema::table('loans', function (Blueprint $table) {
            if (Schema::hasColumn('loans', 'interest_type')) {
                $table->dropColumn('interest_type');
            }
            if (Schema::hasColumn('loans', 'due_date')) {
                $table->dropColumn('due_date');
            }
        });
    }
};
