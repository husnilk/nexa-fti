<?php

use App\Models\Activity;
use App\Models\Employee;
use App\Models\Performance;
use App\Models\Period;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Rubric;
use App\Models\RubricDetail;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\PermissionRegistrar;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    Storage::fake('local');

    Permission::findOrCreate('activity.view', 'web');
    Permission::findOrCreate('activity.manage', 'web');

    $this->manager = User::factory()->create();
    $this->manager->givePermissionTo('activity.manage');

    $this->viewer = User::factory()->create();
    $this->viewer->givePermissionTo('activity.view');

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findOrCreate('super-admin', 'web'));

    $this->guest = User::factory()->create();

    $this->period = Period::factory()->create();
    $this->rubric = Rubric::factory()->create(['rule_max_employee' => -1]);
    $this->chair = RubricDetail::factory()->create([
        'rubric_id' => $this->rubric->id, 'position' => 'Ketua', 'poin' => 6, 'is_fixed_poin' => 1,
    ]);
    $this->member = RubricDetail::factory()->create([
        'rubric_id' => $this->rubric->id, 'position' => 'Anggota', 'poin' => 4, 'is_fixed_poin' => 0,
    ]);
    $this->employee = Employee::factory()->create();
});

function activityPayload(array $overrides = []): array
{
    return array_merge([
        'period_id' => test()->period->id,
        'rubric_id' => test()->rubric->id,
        'name' => 'Panitia Seminar Nasional Teknologi Informasi 2026',
        'document_number' => 'SK/123/UN16.15/2026',
        'evidence_link' => 'https://drive.example.test/sk',
        'shared_performance_evidence' => false,
    ], $overrides);
}

function performancePayload(array $overrides = []): array
{
    return array_merge([
        'employee_id' => test()->employee->id,
        'rubric_detail_id' => test()->member->id,
        'quantity' => 2,
    ], $overrides);
}

describe('activities', function () {
    it('lets viewers and managers see the list and details', function (string $user) {
        $activity = Activity::factory()->create(['period_id' => $this->period->id, 'rubric_id' => $this->rubric->id]);
        Performance::factory()->create(['activity_id' => $activity->id, 'employee_id' => $this->employee->id]);

        actingAs($this->{$user})
            ->get(route('activities.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('activities/index')
                ->has('activities.data', 1)
                ->where('activities.data.0.performances_count', 1));

        actingAs($this->{$user})
            ->get(route('activities.show', $activity))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('activities/show')
                ->has('activity.performances', 1)
                ->has('activity.rubric.details', 2)
                ->has('employees'));
    })->with(['viewer', 'manager', 'admin']);

    it('forbids users without activity permissions', function () {
        $activity = Activity::factory()->create();

        actingAs($this->guest)->get(route('activities.index'))->assertForbidden();
        actingAs($this->guest)->get(route('activities.show', $activity))->assertForbidden();
    });

    it('prevents viewers from changing activities or performances', function () {
        $activity = Activity::factory()->create(['rubric_id' => $this->rubric->id]);
        $performance = Performance::factory()->create(['activity_id' => $activity->id]);

        actingAs($this->viewer)->get(route('activities.create'))->assertForbidden();
        actingAs($this->viewer)->post(route('activities.store'), activityPayload())->assertForbidden();
        actingAs($this->viewer)->get(route('activities.edit', $activity))->assertForbidden();
        actingAs($this->viewer)->put(route('activities.update', $activity), activityPayload())->assertForbidden();
        actingAs($this->viewer)->delete(route('activities.destroy', $activity))->assertForbidden();
        actingAs($this->viewer)->post(route('performances.store', $activity), performancePayload())->assertForbidden();
        actingAs($this->viewer)->put(route('performances.update', [$activity, $performance]), performancePayload())->assertForbidden();
        actingAs($this->viewer)->delete(route('performances.destroy', [$activity, $performance]))->assertForbidden();

        expect(Activity::count())->toBe(1)->and(Performance::count())->toBe(1);
    });

    it('creates an activity and redirects to the manage-performance page', function () {
        actingAs($this->manager)->get(route('activities.create'))->assertOk();

        $response = actingAs($this->manager)->post(route('activities.store'), activityPayload([
            'evidence_file' => UploadedFile::fake()->create('sk.pdf', 200, 'application/pdf'),
        ]));

        $activity = Activity::sole();
        $response->assertRedirect(route('activities.show', $activity));

        expect($activity->created_by_id)->toBe($this->manager->id)
            ->and($activity->form_type)->toBe($this->rubric->fresh()->form_type)
            ->and($activity->shared_performance_evidence)->toBeFalse();
        Storage::disk('local')->assertExists($activity->evidence_file);
    });

    it('stores shared performance evidence only when the checkbox is checked', function () {
        actingAs($this->manager)->post(route('activities.store'), activityPayload([
            'shared_performance_evidence' => true,
            'performance_evidence_file' => UploadedFile::fake()->create('evidence.pdf', 100, 'application/pdf'),
            'performance_evidence_link' => 'https://drive.example.test/evidence',
        ]));

        $activity = Activity::sole();
        expect($activity->shared_performance_evidence)->toBeTrue()
            ->and($activity->performance_evidence_link)->toBe('https://drive.example.test/evidence');
        Storage::disk('local')->assertExists($activity->performance_evidence_file);
        $sharedFile = $activity->performance_evidence_file;

        // Unchecking clears the shared evidence.
        actingAs($this->manager)->put(route('activities.update', $activity), activityPayload([
            'shared_performance_evidence' => false,
            'performance_evidence_link' => 'https://ignored.example.test',
        ]));

        expect($activity->fresh())
            ->shared_performance_evidence->toBeFalse()
            ->performance_evidence_file->toBeNull()
            ->performance_evidence_link->toBeNull();
        Storage::disk('local')->assertMissing($sharedFile);
    });

    it('locks the rubric once employees are added', function () {
        $activity = Activity::factory()->create(['period_id' => $this->period->id, 'rubric_id' => $this->rubric->id]);
        Performance::factory()->create(['activity_id' => $activity->id]);

        actingAs($this->manager)
            ->put(route('activities.update', $activity), activityPayload(['rubric_id' => Rubric::factory()->create()->id]))
            ->assertSessionHasErrors('rubric_id');

        actingAs($this->manager)
            ->put(route('activities.update', $activity), activityPayload(['name' => 'Renamed']))
            ->assertSessionHasNoErrors();

        expect($activity->fresh()->name)->toBe('Renamed');
    });

    it('validates the activity input', function () {
        actingAs($this->manager)
            ->post(route('activities.store'), activityPayload([
                'name' => '',
                'rubric_id' => null,
                'evidence_link' => 'not-a-url',
                'evidence_file' => UploadedFile::fake()->create('script.exe', 10),
            ]))
            ->assertSessionHasErrors(['name', 'rubric_id', 'evidence_link', 'evidence_file']);
    });

    it('soft deletes an activity', function () {
        $activity = Activity::factory()->create();

        actingAs($this->manager)
            ->delete(route('activities.destroy', $activity))
            ->assertRedirect(route('activities.index'));

        expect(Activity::count())->toBe(0)->and(Activity::withTrashed()->count())->toBe(1);
    });

    it('lets viewers download evidence files', function () {
        Storage::disk('local')->put('activities/sk.pdf', 'pdf');
        $activity = Activity::factory()->create(['evidence_file' => 'activities/sk.pdf']);

        actingAs($this->viewer)
            ->get(route('activities.evidence', [$activity, 'document']))
            ->assertOk()
            ->assertDownload('sk.pdf');

        actingAs($this->viewer)
            ->get(route('activities.evidence', [$activity, 'performance']))
            ->assertNotFound();
    });
});

describe('performances', function () {
    beforeEach(function () {
        $this->activity = Activity::factory()->create([
            'period_id' => $this->period->id,
            'rubric_id' => $this->rubric->id,
        ]);
    });

    it('adds an employee with points from the position', function () {
        actingAs($this->manager)
            ->from(route('activities.show', $this->activity))
            ->post(route('performances.store', $this->activity), performancePayload([
                'evidence_link' => 'https://drive.example.test/member',
                'evidence_file' => UploadedFile::fake()->create('cert.pdf', 50, 'application/pdf'),
            ]))
            ->assertRedirect(route('activities.show', $this->activity))
            ->assertSessionHasNoErrors();

        $performance = Performance::sole();

        expect($performance)
            ->employee_id->toBe($this->employee->id)
            ->period_id->toBe($this->period->id)
            ->position->toBe('Anggota')
            ->points->toBe(8.0)
            ->operator_id->toBe($this->manager->id)
            ->evidence_link->toBe('https://drive.example.test/member');
        Storage::disk('local')->assertExists($performance->evidence_file);
    });

    it('accepts a points override only for non-fixed positions', function () {
        actingAs($this->manager)->post(route('performances.store', $this->activity), performancePayload(['points' => 5]));
        expect(Performance::sole()->points)->toBe(5.0);

        $other = Employee::factory()->create();
        actingAs($this->manager)->post(route('performances.store', $this->activity), performancePayload([
            'employee_id' => $other->id,
            'rubric_detail_id' => $this->chair->id,
            'quantity' => 1,
            'points' => 100,
        ]));

        expect(Performance::where('employee_id', $other->id)->sole()->points)->toBe(6.0);
    });

    it('ignores per-employee evidence when the activity shares evidence', function () {
        $this->activity->update(['shared_performance_evidence' => true]);

        actingAs($this->manager)->post(route('performances.store', $this->activity), performancePayload([
            'evidence_link' => 'https://drive.example.test/member',
            'evidence_file' => UploadedFile::fake()->create('cert.pdf', 50, 'application/pdf'),
        ]))->assertSessionHasNoErrors();

        expect(Performance::sole())
            ->evidence_link->toBeNull()
            ->evidence_file->toBeNull();
    });

    it('updates an employee involvement', function () {
        $performance = Performance::factory()->create([
            'activity_id' => $this->activity->id,
            'employee_id' => $this->employee->id,
            'rubric_detail_id' => $this->member->id,
        ]);

        actingAs($this->manager)
            ->put(route('performances.update', [$this->activity, $performance]), performancePayload([
                'rubric_detail_id' => $this->chair->id,
                'quantity' => 1,
            ]))
            ->assertSessionHasNoErrors();

        expect($performance->fresh())
            ->position->toBe('Ketua')
            ->points->toBe(6.0);
    });

    it('removes an employee from the activity', function () {
        $performance = Performance::factory()->create(['activity_id' => $this->activity->id]);

        actingAs($this->manager)
            ->delete(route('performances.destroy', [$this->activity, $performance]))
            ->assertRedirect();

        expect(Performance::count())->toBe(0);
    });

    it('rejects duplicates, foreign positions and employees beyond the rubric limit', function () {
        Performance::factory()->create(['activity_id' => $this->activity->id, 'employee_id' => $this->employee->id]);

        actingAs($this->manager)
            ->post(route('performances.store', $this->activity), performancePayload())
            ->assertSessionHasErrors('employee_id');

        actingAs($this->manager)
            ->post(route('performances.store', $this->activity), performancePayload([
                'employee_id' => Employee::factory()->create()->id,
                'rubric_detail_id' => RubricDetail::factory()->create()->id,
            ]))
            ->assertSessionHasErrors('rubric_detail_id');

        $this->rubric->update(['rule_max_employee' => 1]);

        actingAs($this->manager)
            ->post(route('performances.store', $this->activity), performancePayload([
                'employee_id' => Employee::factory()->create()->id,
            ]))
            ->assertSessionHasErrors('employee_id');

        expect(Performance::count())->toBe(1);
    });

    it('does not resolve a performance through another activity', function () {
        $performance = Performance::factory()->create();

        actingAs($this->manager)
            ->delete(route('performances.destroy', [$this->activity, $performance]))
            ->assertNotFound();

        expect(Performance::count())->toBe(1);
    });
});
