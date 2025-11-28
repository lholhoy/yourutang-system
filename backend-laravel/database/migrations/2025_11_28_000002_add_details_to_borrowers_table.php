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
        Schema::table('borrowers', function (Blueprint $table) {
            $table->string('email')->nullable()->after('contact');
            $table->text('address')->nullable()->after('email');
            $table->string('id_type')->nullable()->after('address');
            $table->string('id_number')->nullable()->after('id_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('borrowers', function (Blueprint $table) {
            $table->dropColumn(['email', 'address', 'id_type', 'id_number']);
        });
    }
};
