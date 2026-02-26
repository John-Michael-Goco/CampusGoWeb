<?php

use App\Models\Badge;
use App\Models\Coupon;
use App\Models\Location;
use App\Models\Quest;
use App\Models\QuestStep;
use App\Models\Reward;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\UserCoupon;
use App\Models\UserQuest;
use App\Models\UserQuestStep;

test('all Phase 1 models can be created and relations work', function () {
    $user = User::factory()->create();

    $loc = Location::create([
        'name' => 'Test Location',
        'latitude' => 14.5,
        'longitude' => 121.0,
    ]);
    expect($loc->id)->toBeGreaterThan(0);

    $quest = Quest::create([
        'title' => 'Test Quest',
        'quest_type' => 'daily',
        'created_by_user_id' => $user->id,
        'location_id' => $loc->id,
    ]);
    expect($quest->createdBy->id)->toBe($user->id);
    expect($quest->location->id)->toBe($loc->id);

    $step = QuestStep::create([
        'quest_id' => $quest->id,
        'step_order' => 1,
    ]);
    expect($step->quest->id)->toBe($quest->id);
    expect($quest->steps()->count())->toBe(1);

    $userQuest = UserQuest::create([
        'user_id' => $user->id,
        'quest_id' => $quest->id,
    ]);
    expect($userQuest->user->id)->toBe($user->id);
    expect($userQuest->quest->id)->toBe($quest->id);

    $userQuestStep = UserQuestStep::create([
        'user_id' => $user->id,
        'quest_id' => $quest->id,
        'step_id' => $step->id,
    ]);
    expect($userQuestStep->step->id)->toBe($step->id);

    $reward = Reward::create(['reward_type' => 'xp', 'amount' => 10]);
    $quest->rewards()->attach($reward->id);
    expect($quest->rewards()->count())->toBe(1);
    expect($reward->quests()->count())->toBe(1);

    $coupon = Coupon::create(['code' => 'TESTCODE', 'type' => 'discount']);
    expect($coupon->id)->toBeGreaterThan(0);

    $badge = Badge::create(['name' => 'Test Badge', 'xp_reward' => 5]);
    expect($badge->id)->toBeGreaterThan(0);

    $userCoupon = UserCoupon::create([
        'user_id' => $user->id,
        'coupon_id' => $coupon->id,
    ]);
    expect($userCoupon->coupon->code)->toBe('TESTCODE');
    expect($user->userCoupons()->count())->toBe(1);

    $userBadge = UserBadge::create([
        'user_id' => $user->id,
        'badge_id' => $badge->id,
    ]);
    expect($userBadge->badge->name)->toBe('Test Badge');
    expect($user->userBadges()->count())->toBe(1);

    expect($user->userQuests()->count())->toBe(1);
    expect($user->userQuestSteps()->count())->toBe(1);
    expect($loc->quests()->count())->toBe(1);
});
