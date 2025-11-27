<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Debugging Auth ---\n";

// 1. Test User Creation with Cast
$email = 'debug_' . time() . '@example.com';
$password = 'password123';

echo "Creating user $email with password '$password'...\n";

// Simulate RegisteredUserController logic (no Hash::make)
$user = User::create([
    'name' => 'Debug User',
    'email' => $email,
    'password' => $password, 
]);

echo "User created. ID: " . $user->id . "\n";
echo "Stored Password Hash: " . $user->password . "\n";

// 2. Verify Hash manually
if (Hash::check($password, $user->password)) {
    echo "SUCCESS: Hash::check passed.\n";
} else {
    echo "FAILURE: Hash::check failed.\n";
}

// 3. Verify Auth::attempt
if (Auth::attempt(['email' => $email, 'password' => $password])) {
    echo "SUCCESS: Auth::attempt passed.\n";
} else {
    echo "FAILURE: Auth::attempt failed.\n";
}

// 4. Check existing user 'loloy@gmail.com' if it exists
$loloy = User::where('email', 'loloy@gmail.com')->first();
if ($loloy) {
    echo "\nChecking user 'loloy@gmail.com'...\n";
    echo "Stored Hash: " . $loloy->password . "\n";
    // Try to check against 'loloy12345' (from screenshot)
    if (Hash::check('loloy12345', $loloy->password)) {
        echo "SUCCESS: Password 'loloy12345' matches.\n";
    } else {
        echo "FAILURE: Password 'loloy12345' does NOT match.\n";
    }
}
