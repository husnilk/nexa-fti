<?php

use App\Models\Activity;
use App\Models\Employee;
use App\Models\Performance;
use App\Models\Period;
use App\Models\Permission;
use App\Models\Rubric;
use App\Models\RubricDetail;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

/**
 * Org chart used by every test:
 *   head (supervisor of verifier) → verifier → member
 * The verifier verifies the activity and is also one of its employees.
 */
beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    Storage::fake('local');

    Permission::findOrCreate('dashboard.view', 'web');
    Permission::findOrCreate('activity.manage', 'web');

    $this->head = Employee::factory()->create(['name' => 'Kepala Departemen']);
    $this->verifierEmployee = Employee::factory()->create(['name' => 'Verifikator', 'supervisor_id' => $this->head->id]);
    $this->member = Employee::factory()->create(['name' => 'Anggota Tim']);
    $this->outsider = Employee::factory()->create();

    $this->headUser = User::find($this->head->id);
    $this->verifier = User::find($this->verifierEmployee->id);
    $this->outsiderUser = User::find($this->outsider->id);

    $this->operator = User::factory()->create();
    $this->operator->givePermissionTo('activity.manage');

    $rubric = Rubric::factory()->create(['rule_max_employee' => -1]);
    $this->detail = RubricDetail::factory()->create(['rubric_id' => $rubric->id, 'poin' => 4, 'is_fixed_poin' => 0]);

    $this->activity = Activity::factory()->create([
        'period_id' => Period::factory()->create()->id,
        'rubric_id' => $rubric->id,
        'verifier_id' => $this->verifier->id,
    ]);

    $this->memberPerformance = Performance::factory()->create([
        'activity_id' => $this->activity->id,
        'employee_id' => $this->member->id,
        'rubric_detail_id' => $this->detail->id,
        'verification_status' => Performance::VERIFICATION_PENDING,
    ]);
    $this->ownPerformance = Performance::factory()->create([
        'activity_id' => $this->activity->id,
        'employee_id' => $this->verifierEmployee->id,
        'rubric_detail_id' => $this->detail->id,
        'verification_status' => Performance::VERIFICATION_PENDING,
    ]);
});

function verify(User $user, Performance $performance, int $status, ?string $reason = null)
{
    return actingAs($user)->post(
        route('performance-verifications.verify', $performance),
        array_filter(['status' => $status, 'reason' => $reason], fn ($value) => $value !== null),
    );
}

describe('queue', function () {
    it('lists the activity for its verifier, without their own performance', function () {
        actingAs($this->verifier)
            ->get(route('performance-verifications.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('performance-verifications/index')
                ->has('activities.data', 1)
                ->where('activities.data.0.verifiable_count', 1)
                ->where('activities.data.0.pending_count', 1));

        actingAs($this->verifier)
            ->get(route('performance-verifications.show', $this->activity))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('performance-verifications/show')
                ->has('performances', 1)
                ->where('performances.0.employee_id', $this->member->id)
                ->where('ownPerformance.supervisor.id', $this->head->id));
    });

    it('routes the verifier\'s own performance to their supervisor', function () {
        actingAs($this->headUser)
            ->get(route('performance-verifications.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('activities.data', 1)
                ->where('activities.data.0.verifiable_count', 1));

        actingAs($this->headUser)
            ->get(route('performance-verifications.show', $this->activity))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('performances', 1)
                ->where('performances.0.employee_id', $this->verifierEmployee->id)
                ->where('ownPerformance', null));
    });

    it('hides activities from users who verify nothing in them', function () {
        actingAs($this->outsiderUser)
            ->get(route('performance-verifications.index'))
            ->assertInertia(fn (Assert $page) => $page->has('activities.data', 0));

        actingAs($this->outsiderUser)
            ->get(route('performance-verifications.show', $this->activity))
            ->assertForbidden();
    });

    it('filters to activities with pending work', function () {
        verify($this->verifier, $this->memberPerformance, Performance::VERIFICATION_APPROVED);

        actingAs($this->verifier)
            ->get(route('performance-verifications.index', ['pending' => 1]))
            ->assertInertia(fn (Assert $page) => $page->has('activities.data', 0));
    });

    it('shares whether the user is a verifier', function () {
        $this->verifier->givePermissionTo('dashboard.view');
        $this->outsiderUser->givePermissionTo('dashboard.view');
        $this->headUser->givePermissionTo('dashboard.view');

        actingAs($this->verifier)->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('auth.is_verifier', true));
        actingAs($this->headUser)->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('auth.is_verifier', true));
        actingAs($this->outsiderUser)->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('auth.is_verifier', false));
    });
});

describe('decisions', function () {
    it('approves a performance', function () {
        $this->memberPerformance->update(['verification_reason' => 'old reason']);

        verify($this->verifier, $this->memberPerformance, Performance::VERIFICATION_APPROVED)
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        expect($this->memberPerformance->fresh())
            ->verification_status->toBe(Performance::VERIFICATION_APPROVED)
            ->verifier_id->toBe($this->verifier->id)
            ->verification_reason->toBeNull();
    });

    it('requires a reason to reject or return', function (int $status) {
        verify($this->verifier, $this->memberPerformance, $status)->assertSessionHasErrors('reason');

        verify($this->verifier, $this->memberPerformance, $status, 'Bukti SK tidak sesuai.')
            ->assertSessionHasNoErrors();

        expect($this->memberPerformance->fresh())
            ->verification_status->toBe($status)
            ->verification_reason->toBe('Bukti SK tidak sesuai.');
    })->with([
        'reject' => Performance::VERIFICATION_REJECTED,
        'return' => Performance::VERIFICATION_RETURNED,
    ]);

    it('does not let a verifier verify their own performance', function () {
        verify($this->verifier, $this->ownPerformance, Performance::VERIFICATION_APPROVED)->assertForbidden();

        expect($this->ownPerformance->fresh()->verification_status)->toBe(Performance::VERIFICATION_PENDING);
    });

    it('lets the supervisor verify the verifier\'s own performance only', function () {
        verify($this->headUser, $this->ownPerformance, Performance::VERIFICATION_APPROVED)->assertSessionHasNoErrors();
        verify($this->headUser, $this->memberPerformance, Performance::VERIFICATION_APPROVED)->assertForbidden();

        expect($this->ownPerformance->fresh())
            ->verification_status->toBe(Performance::VERIFICATION_APPROVED)
            ->verifier_id->toBe($this->headUser->id);
    });

    it('forbids unrelated users and invalid statuses', function () {
        verify($this->outsiderUser, $this->memberPerformance, Performance::VERIFICATION_APPROVED)->assertForbidden();
        verify($this->verifier, $this->memberPerformance, 9)->assertSessionHasErrors('status');
    });
});

describe('effect on activity management', function () {
    it('locks approved and rejected performances', function (int $status) {
        $this->memberPerformance->update(['verification_status' => $status]);

        actingAs($this->operator)
            ->put(route('performances.update', [$this->activity, $this->memberPerformance]), [
                'employee_id' => $this->member->id,
                'rubric_detail_id' => $this->detail->id,
                'quantity' => 5,
            ])
            ->assertSessionHasErrors('performance');

        actingAs($this->operator)
            ->delete(route('performances.destroy', [$this->activity, $this->memberPerformance]))
            ->assertSessionHasErrors('performance');

        expect($this->memberPerformance->fresh())->not->toBeNull()->quantity->toBe(1.0);
    })->with([
        'approved' => Performance::VERIFICATION_APPROVED,
        'rejected' => Performance::VERIFICATION_REJECTED,
    ]);

    it('sends a corrected returned performance back to pending', function () {
        verify($this->verifier, $this->memberPerformance, Performance::VERIFICATION_RETURNED, 'Jumlah salah.');

        actingAs($this->operator)
            ->put(route('performances.update', [$this->activity, $this->memberPerformance]), [
                'employee_id' => $this->member->id,
                'rubric_detail_id' => $this->detail->id,
                'quantity' => 2,
            ])
            ->assertSessionHasNoErrors();

        expect($this->memberPerformance->fresh())
            ->verification_status->toBe(Performance::VERIFICATION_PENDING)
            ->quantity->toBe(2.0);
    });

    it('starts new performances as pending', function () {
        actingAs($this->operator)->post(route('performances.store', $this->activity), [
            'employee_id' => $this->outsider->id,
            'rubric_detail_id' => $this->detail->id,
            'quantity' => 1,
        ])->assertSessionHasNoErrors();

        expect(Performance::where('employee_id', $this->outsider->id)->sole()->verification_status)
            ->toBe(Performance::VERIFICATION_PENDING);
    });

    it('blocks deleting an activity with verified performances', function () {
        verify($this->verifier, $this->memberPerformance, Performance::VERIFICATION_APPROVED);

        actingAs($this->operator)
            ->delete(route('activities.destroy', $this->activity))
            ->assertSessionHasErrors('activity');

        expect(Activity::count())->toBe(1);
    });

    it('saves the verifier from the activity form', function () {
        $newVerifier = Employee::factory()->create();

        actingAs($this->operator)->put(route('activities.update', $this->activity), [
            'period_id' => $this->activity->period_id,
            'rubric_id' => $this->activity->rubric_id,
            'name' => $this->activity->name,
            'verifier_id' => $newVerifier->id,
        ])->assertSessionHasNoErrors();

        expect($this->activity->fresh()->verifier_id)->toBe($newVerifier->id);
    });
});

it('lets verifiers download evidence without activity permissions', function () {
    Storage::disk('local')->put('activities/member.pdf', 'pdf');
    $this->memberPerformance->update(['evidence_file' => 'activities/member.pdf']);

    actingAs($this->verifier)
        ->get(route('performance-verifications.performance-evidence', $this->memberPerformance))
        ->assertOk()
        ->assertDownload('member.pdf');

    actingAs($this->outsiderUser)
        ->get(route('performance-verifications.performance-evidence', $this->memberPerformance))
        ->assertForbidden();
});

describe('active period only', function () {
    beforeEach(function () {
        // Activating another period deactivates the activity's period.
        $this->newPeriod = Period::factory()->create();
        expect($this->activity->period->fresh()->isActive())->toBeFalse();
    });

    it('hides activities outside the active period from the queue', function () {
        actingAs($this->verifier)
            ->get(route('performance-verifications.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('activePeriod.id', $this->newPeriod->id)
                ->has('activities.data', 0));

        actingAs($this->verifier)
            ->get(route('performance-verifications.show', $this->activity))
            ->assertForbidden();
    });

    it('refuses decisions and evidence outside the active period', function () {
        verify($this->verifier, $this->memberPerformance, Performance::VERIFICATION_APPROVED)->assertForbidden();
        verify($this->headUser, $this->ownPerformance, Performance::VERIFICATION_APPROVED)->assertForbidden();

        actingAs($this->verifier)
            ->get(route('performance-verifications.activity-evidence', [$this->activity, 'document']))
            ->assertForbidden();

        expect($this->memberPerformance->fresh()->verification_status)->toBe(Performance::VERIFICATION_PENDING);
    });

    it('stops flagging the user as a verifier', function () {
        $this->verifier->givePermissionTo('dashboard.view');

        actingAs($this->verifier)->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('auth.is_verifier', false));
    });

    it('shows nothing when no period is active', function () {
        Period::query()->update(['status' => Period::STATUS_INACTIVE]);

        actingAs($this->verifier)
            ->get(route('performance-verifications.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('activePeriod', null)
                ->has('activities.data', 0));
    });
});
