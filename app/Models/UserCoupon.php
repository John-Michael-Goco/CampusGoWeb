<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCoupon extends Model
{
    protected $table = 'user_coupons';

    protected $fillable = [
        'user_id',
        'coupon_id',
        'redeemed',
        'redeemed_at',
    ];

    protected function casts(): array
    {
        return [
            'redeemed' => 'boolean',
            'redeemed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }
}
