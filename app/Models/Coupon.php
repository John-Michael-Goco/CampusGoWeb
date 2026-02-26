<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'description',
        'type',
        'quantity',
        'expired_at',
    ];

    protected function casts(): array
    {
        return [
            'expired_at' => 'datetime',
        ];
    }

    public function userCoupons(): HasMany
    {
        return $this->hasMany(UserCoupon::class);
    }
}
