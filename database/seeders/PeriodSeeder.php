<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Period;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Semester remuneration periods from 2018-1 up to the period covering today.
 *
 * No 1 covers January–June, no 2 covers July–December. Each period gets its
 * six months (workdays = Monday–Friday count) and every organization attached.
 * Only the period covering today is active.
 */
class PeriodSeeder extends Seeder
{
    private const FIRST_YEAR = 2018;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $today = now()->startOfDay();
        $organizations = Organization::pluck('id');

        for ($year = self::FIRST_YEAR; $year <= $today->year; $year++) {
            foreach ([1, 2] as $no) {
                $start = Carbon::create($year, $no === 1 ? 1 : 7, 1);
                $end = $start->copy()->addMonths(5)->endOfMonth();

                if ($start->isAfter($today)) {
                    break 2;
                }

                $period = $this->seedPeriod($year, $no, $start, $end, $today->between($start, $end));
                $this->seedMonths($period, $start);
                $this->seedOrganizations($period, $organizations->all());
            }
        }
    }

    private function seedPeriod(int $year, int $no, Carbon $start, Carbon $end, bool $isCurrent): Period
    {
        // Claims for a semester are entered, verified and validated in the following month.
        $input = $end->copy()->addDay();

        return Period::updateOrCreate(
            ['year' => $year, 'no' => $no],
            [
                'name' => "Period {$no} {$year} (".($no === 1 ? 'January – June' : 'July – December').')',
                'start_date' => $start->toDateString(),
                'end_date' => $end->toDateString(),
                'input_start_date' => $input->toDateString(),
                'input_end_date' => $input->copy()->addDays(9)->toDateString(),
                'verification_start_date' => $input->copy()->addDays(10)->toDateString(),
                'verification_end_date' => $input->copy()->addDays(16)->toDateString(),
                'validation_start_date' => $input->copy()->addDays(17)->toDateString(),
                'validation_end_date' => $input->copy()->addDays(23)->toDateString(),
                'description' => "Remuneration period {$no} of {$year}.",
                'bkd_year' => $year,
                // Jan–Jun falls in the even (Genap) semester, Jul–Dec in the odd (Ganjil) one.
                'bkd_semester' => $no === 1 ? 'Genap' : 'Ganjil',
                'pir' => 3000,
                'status' => $isCurrent ? Period::STATUS_ACTIVE : Period::STATUS_INACTIVE,
            ]
        );
    }

    private function seedMonths(Period $period, Carbon $start): void
    {
        for ($offset = 0; $offset < 6; $offset++) {
            $month = $start->copy()->addMonths($offset);

            $period->months()->updateOrCreate(
                ['month' => $month->month],
                ['workdays' => $this->weekdaysIn($month)]
            );
        }
    }

    /**
     * @param  list<string>  $organizationIds
     */
    private function seedOrganizations(Period $period, array $organizationIds): void
    {
        foreach ($organizationIds as $organizationId) {
            $period->organizations()->firstOrCreate(['organization_id' => $organizationId]);
        }
    }

    private function weekdaysIn(Carbon $month): int
    {
        $day = $month->copy()->startOfMonth();
        $last = $month->copy()->endOfMonth();
        $count = 0;

        while ($day->lte($last)) {
            $count += $day->isWeekday() ? 1 : 0;
            $day->addDay();
        }

        return $count;
    }
}
