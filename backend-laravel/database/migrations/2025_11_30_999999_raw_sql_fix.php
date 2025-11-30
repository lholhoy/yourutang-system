<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add profile_image to users if it doesn't exist
        $usersColumns = DB::select("SHOW COLUMNS FROM users LIKE 'profile_image'");
        if (empty($usersColumns)) {
            DB::statement("ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) NULL AFTER email");
        }

        // Add interest_type to loans if it doesn't exist
        $loansColumnsInterest = DB::select("SHOW COLUMNS FROM loans LIKE 'interest_type'");
        if (empty($loansColumnsInterest)) {
            DB::statement("ALTER TABLE loans ADD COLUMN interest_type VARCHAR(255) DEFAULT 'monthly' AFTER interest_rate");
        }

        // Add due_date to loans if it doesn't exist
        $loansColumnsDue = DB::select("SHOW COLUMNS FROM loans LIKE 'due_date'");
        if (empty($loansColumnsDue)) {
            DB::statement("ALTER TABLE loans ADD COLUMN due_date DATE NULL AFTER term_months");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optional: Drop columns if needed
    }
};
