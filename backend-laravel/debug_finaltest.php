<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Debugging FinalTest ---\n";

$email = 'finaltest@gmail.com';
$password = 'P4ssword';

$user = User::where('email', $email)->first();

if (!$user) {
    echo "User $email NOT FOUND.\n";
    exit;
}

echo "User ID: " . $user->id . "\n";
echo "Stored Hash: " . $user->password . "\n";

// Check Hash
if (Hash::check($password, $user->password)) {
    echo "Hash Check: MATCH\n";
} else {
    echo "Hash Check: MISMATCH\n";
}

// Check Auth::attempt
if (Auth::attempt(['email' => $email, 'password' => $password])) {
    echo "Auth::attempt: SUCCESS\n";
} else {
    echo "Auth::attempt: FAILED\n";
}
