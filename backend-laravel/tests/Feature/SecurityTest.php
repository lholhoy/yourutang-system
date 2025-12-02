<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Borrower;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_users_cannot_access_borrowers()
    {
        $response = $this->getJson('/api/borrowers');

        $response->assertStatus(401);
    }

    public function test_users_cannot_access_other_users_borrowers_idor()
    {
        // Create two users
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        // User A creates a borrower (Authenticate as User A first)
        $this->actingAs($userA);
        $borrowerA = Borrower::create([
            'user_id' => $userA->id,
            'name' => 'Victim Borrower',
            'contact' => '09123456789',
        ]);

        // User B tries to access User A's borrower
        $response = $this->actingAs($userB)
                         ->getJson("/api/borrowers/{$borrowerA->id}");

        // Should be 404 because of the scoped query "where('user_id', Auth::id())->findOrFail($id)"
        $response->assertStatus(404);
    }

    public function test_loan_amount_must_be_positive()
    {
        $user = User::factory()->create();
        
        $this->actingAs($user);
        $borrower = Borrower::create([
            'user_id' => $user->id,
            'name' => 'Test Borrower',
            'contact' => '09123456789',
        ]);

        $response = $this->postJson('/api/loans', [
             'borrower_id' => $borrower->id,
             'amount' => -5000, // Negative amount
             'date_borrowed' => now()->toDateString(),
         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['amount']);
    }

    public function test_xss_payload_is_stored_but_escaped_in_json()
    {
        $user = User::factory()->create();
        $payload = '<script>alert("XSS")</script>';

        $response = $this->actingAs($user)
                         ->postJson('/api/borrowers', [
                             'name' => 'Attacker',
                             'notes' => $payload,
                         ]);

        $response->assertStatus(201);
        
        // Verify it is stored as is
        $this->assertDatabaseHas('borrowers', [
            'notes' => $payload,
        ]);

        // Verify JSON response contains it (React handles escaping)
        $response->assertJsonFragment(['notes' => $payload]);
    }
}
