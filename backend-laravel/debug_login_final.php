<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Debugging Login Final ---\n";

$users = User::all();

foreach ($users as $user) {
    echo "\nUser: " . $user->email . "\n";
    echo "ID: " . $user->id . "\n";
    echo "Stored Password: " . $user->password . "\n";
    
    // Check if it looks hashed
    $isHashed = strlen($user->password) === 60 && str_starts_with($user->password, '$2y$');
    echo "Looks Bcrypt Hashed? " . ($isHashed ? "YES" : "NO") . "\n";

    // Try to check against 'loloy12345'
    if (Hash::check('loloy12345', $user->password)) {
        echo "MATCH: Password is 'loloy12345'\n";
    } else {
        echo "NO MATCH for 'loloy12345'\n";
    }

    // Try Auth::attempt
    if (Auth::attempt(['email' => $user->email, 'password' => 'loloy12345'])) {
        echo "Auth::attempt: SUCCESS\n";
    } else {
        echo "Auth::attempt: FAILED\n";
    }
}
