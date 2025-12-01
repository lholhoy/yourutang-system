<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('loans', 'term_unit')) {
            DB::statement("ALTER TABLE loans ADD COLUMN term_unit VARCHAR(255) DEFAULT 'months' AFTER term_months");
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('loans', 'term_unit')) {
            DB::statement("ALTER TABLE loans DROP COLUMN term_unit");
        }
    }
};
