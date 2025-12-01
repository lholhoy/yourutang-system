<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrower extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'contact',
        'email',
        'address',
        'province',
        'city',
        'barangay',
        'street',
        'id_type',
        'id_number',
        'notes',
    ];

    protected $appends = ['full_address'];

    public function getFullAddressAttribute()
    {
        $parts = [
            $this->street,
            $this->barangay,
            $this->city,
            $this->province
        ];

        $filtered = array_filter($parts, fn($value) => !is_null($value) && $value !== '');

        if (empty($filtered)) {
            return $this->address; // Fallback to old address field
        }

        return implode(', ', $filtered);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }
}
