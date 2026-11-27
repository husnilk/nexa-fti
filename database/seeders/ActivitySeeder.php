<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Performance;
use App\Models\Period;
use App\Models\Rubric;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

/**
 * Remuneration activities with the employees involved (performances).
 *
 * - Active period: a mix of pending, approved, returned and rejected performances,
 *   verified by Dr. Ahmad Hidayat (ahmad@example.com).
 * - One activity is verified by Siti Aminah, who also takes part in it; her own
 *   performance is routed to her supervisor, Dr. Ahmad Hidayat.
 * - Previous period: the same kind of activities, fully approved.
 *
 * Requires PeriodSeeder, RubricSeeder and EmployeeSeeder. Safe to re-run.
 */
class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $active = Period::active();

        if (! $active) {
            $this->command?->warn('ActivitySeeder skipped: no active period. Run PeriodSeeder first.');

            return;
        }

        $rubrics = Rubric::with('details')->get()->keyBy('code');

        if ($rubrics->isEmpty()) {
            $this->command?->warn('ActivitySeeder skipped: no rubrics. Run RubricSeeder first.');

            return;
        }

        $ahmad = Employee::whereHas('user', fn ($q) => $q->where('email', 'ahmad@example.com'))->first();
        $siti = Employee::whereHas('user', fn ($q) => $q->where('email', 'siti@example.com'))->first();

        $staff = Employee::query()
            ->whereNotIn('id', array_filter([$ahmad?->id, $siti?->id]))
            ->orderBy('emp_number')
            ->take(8)
            ->get()
            ->values();

        if (! $ahmad || ! $siti || $staff->count() < 8) {
            $this->command?->warn('ActivitySeeder skipped: needs EmployeeSeeder, LecturerSeeder and StaffSeeder data.');

            return;
        }

        // Siti's own performance is verified by her supervisor.
        $siti->update(['supervisor_id' => $ahmad->id]);

        $operator = User::where('email', 'test@example.com')->first() ?? User::find($ahmad->id);
        $organization = Organization::first();

        foreach ($this->activities($active, $ahmad, $siti, $staff) as $data) {
            $this->seedActivity($data, $active, $rubrics, $operator, $organization, $ahmad);
        }

        $previous = Period::query()
            ->whereDate('start_date', '<', $active->start_date->toDateString())
            ->orderByDesc('start_date')
            ->first();

        if ($previous) {
            foreach ($this->previousActivities($previous, $ahmad, $staff) as $data) {
                $this->seedActivity($data, $previous, $rubrics, $operator, $organization, $ahmad);
            }
        }
    }

    /**
     * @param  Collection<int, Employee>  $staff
     * @return list<array<string, mixed>>
     */
    private function activities(Period $period, Employee $ahmad, Employee $siti, Collection $staff): array
    {
        $year = $period->year;
        $semester = $this->semester($period);

        $doi = "https://doi.org/10.1109/ACCESS.{$year}.3412345";

        return [
            [
                'rubric' => 'PND-01',
                'name' => "Pembimbingan Tugas Akhir Semester {$semester}",
                'document_number' => "SK Dekan No. 112/UN16.15/KPT/{$year}",
                'verifier' => $ahmad,
                'evidence_link' => 'https://drive.example.test/sk/pembimbing-ta',
                'performances' => [
                    [$staff[0], 'Pembimbing Utama', 4, Performance::VERIFICATION_APPROVED],
                    [$staff[1], 'Pembimbing Utama', 3, Performance::VERIFICATION_PENDING],
                    [$staff[2], 'Pembimbing Pendamping', 5, Performance::VERIFICATION_RETURNED, 'Jumlah mahasiswa tidak sesuai dengan SK (tercantum 3 mahasiswa).'],
                    [$staff[3], 'Pembimbing Pendamping', 2, Performance::VERIFICATION_PENDING],
                ],
            ],
            [
                'rubric' => 'PND-02',
                'name' => "Penguji Sidang Tugas Akhir Semester {$semester}",
                'document_number' => "SK Dekan No. 118/UN16.15/KPT/{$year}",
                'verifier' => $ahmad,
                'shared' => 'https://drive.example.test/berita-acara/sidang-ta',
                'performances' => [
                    [$staff[4], 'Ketua Penguji', 6, Performance::VERIFICATION_PENDING],
                    [$staff[0], 'Anggota Penguji', 8, Performance::VERIFICATION_PENDING],
                    [$staff[5], 'Anggota Penguji', 7, Performance::VERIFICATION_APPROVED],
                ],
            ],
            [
                'rubric' => 'PNL-01',
                'name' => 'Publikasi: Deep Learning for Rice Leaf Disease Detection on Edge Devices (Jurnal Q2)',
                'document_number' => "DOI 10.1109/ACCESS.{$year}.3412345",
                'verifier' => $ahmad,
                'performances' => [
                    [$staff[1], 'Penulis Utama', 1, Performance::VERIFICATION_PENDING, null, $doi],
                    [$staff[6], 'Penulis Anggota', 1, Performance::VERIFICATION_REJECTED, 'Nama tidak tercantum sebagai penulis pada artikel yang diunggah.', $doi],
                ],
            ],
            [
                'rubric' => 'PNL-02',
                'name' => "Hibah Penelitian Fundamental {$year}: Sistem Rekomendasi Mata Kuliah Pilihan Berbasis Graf Pengetahuan",
                'document_number' => "Kontrak No. 041/E5/PG.02.00.PL/{$year}",
                'verifier' => $ahmad,
                'shared' => 'https://drive.example.test/kontrak/hibah-fundamental',
                'performances' => [
                    [$staff[2], 'Ketua', 1, Performance::VERIFICATION_PENDING],
                    [$staff[3], 'Anggota', 1, Performance::VERIFICATION_PENDING],
                    [$staff[7], 'Anggota', 1, Performance::VERIFICATION_PENDING],
                ],
            ],
            [
                'rubric' => 'PKM-01',
                'name' => 'Pelatihan Literasi Digital dan Pemasaran Daring bagi UMKM Kota Padang',
                'document_number' => "SK LPPM No. 77/UN16.19/PM/{$year}",
                'verifier' => $ahmad,
                'shared' => 'https://drive.example.test/laporan/pkm-umkm-padang',
                'performances' => [
                    [$staff[5], 'Ketua', 1, Performance::VERIFICATION_APPROVED],
                    [$staff[6], 'Anggota', 1, Performance::VERIFICATION_APPROVED],
                    [$staff[7], 'Anggota', 1, Performance::VERIFICATION_PENDING],
                ],
            ],
            [
                // Siti verifies and takes part; her own row goes to Dr. Ahmad Hidayat.
                'rubric' => 'PNJ-01',
                'name' => "Panitia Seminar Nasional Teknologi Informasi {$year}",
                'document_number' => "SK Dekan No. 131/UN16.15/KPT/{$year}",
                'verifier' => $siti,
                'shared' => 'https://drive.example.test/sk/panitia-semnas-ti',
                'performances' => [
                    [$staff[4], 'Ketua', 1, Performance::VERIFICATION_PENDING],
                    [$siti, 'Sekretaris', 1, Performance::VERIFICATION_PENDING],
                    [$staff[0], 'Anggota', 1, Performance::VERIFICATION_PENDING],
                    [$staff[1], 'Anggota', 1, Performance::VERIFICATION_RETURNED, 'Lampirkan daftar hadir rapat panitia.'],
                ],
            ],
        ];
    }

    /**
     * @param  Collection<int, Employee>  $staff
     * @return list<array<string, mixed>>
     */
    private function previousActivities(Period $period, Employee $ahmad, Collection $staff): array
    {
        $year = $period->year;
        $approved = Performance::VERIFICATION_APPROVED;

        return [
            [
                'rubric' => 'PND-01',
                'name' => "Pembimbingan Tugas Akhir Semester {$this->semester($period)}",
                'document_number' => "SK Dekan No. 54/UN16.15/KPT/{$year}",
                'verifier' => $ahmad,
                'performances' => [
                    [$staff[0], 'Pembimbing Utama', 3, $approved],
                    [$staff[2], 'Pembimbing Pendamping', 4, $approved],
                ],
            ],
            [
                'rubric' => 'PNJ-01',
                'name' => "Panitia Wisuda Fakultas Teknologi Informasi Semester {$this->semester($period)}",
                'document_number' => "SK Dekan No. 61/UN16.15/KPT/{$year}",
                'verifier' => $ahmad,
                'shared' => 'https://drive.example.test/sk/panitia-wisuda',
                'performances' => [
                    [$staff[3], 'Ketua', 1, $approved],
                    [$staff[5], 'Sekretaris', 1, $approved],
                    [$staff[6], 'Anggota', 1, $approved],
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  Collection<string, Rubric>  $rubrics
     */
    private function seedActivity(
        array $data,
        Period $period,
        Collection $rubrics,
        ?User $operator,
        ?Organization $organization,
        Employee $fallbackVerifier,
    ): void {
        $rubric = $rubrics->get($data['rubric']);

        if (! $rubric) {
            return;
        }

        $shared = isset($data['shared']);

        $activity = Activity::updateOrCreate(
            ['period_id' => $period->id, 'name' => $data['name']],
            [
                'rubric_id' => $rubric->id,
                'organization_id' => $organization?->id,
                'document_number' => $data['document_number'],
                'form_type' => $rubric->form_type,
                'evidence_link' => $data['evidence_link'] ?? null,
                'shared_performance_evidence' => $shared,
                'performance_evidence_link' => $shared ? $data['shared'] : null,
                'verifier_id' => $data['verifier']->id,
                'created_by_id' => $operator?->id,
            ]
        );

        foreach ($data['performances'] as $row) {
            [$employee, $position, $quantity, $status] = $row;
            $reason = $row[4] ?? null;
            $evidenceLink = $row[5] ?? null;

            $detail = $rubric->details->firstWhere('position', $position);

            if (! $detail) {
                continue;
            }

            $verifiedBy = $employee->id === $activity->verifier_id
                ? ($employee->supervisor_id ?? $fallbackVerifier->id)
                : $activity->verifier_id;

            Performance::updateOrCreate(
                ['activity_id' => $activity->id, 'employee_id' => $employee->id],
                [
                    'rubric_detail_id' => $detail->id,
                    'period_id' => $period->id,
                    'name' => $activity->name,
                    'position' => $detail->position,
                    'quantity' => $quantity,
                    'points' => $detail->poin * $quantity,
                    'evidence_link' => $shared ? null : ($evidenceLink ?? "https://drive.example.test/bukti/{$employee->emp_number}"),
                    'verification_status' => $status,
                    'verification_reason' => $reason,
                    'verifier_id' => $status === Performance::VERIFICATION_PENDING ? null : $verifiedBy,
                    'operator_id' => $operator?->id,
                ]
            );
        }
    }

    /**
     * Jan–Jun falls in the even (Genap) semester of the previous academic year, Jul–Dec in the odd (Ganjil) one.
     */
    private function semester(Period $period): string
    {
        return $period->no === 1
            ? 'Genap '.($period->year - 1).'/'.$period->year
            : 'Ganjil '.$period->year.'/'.($period->year + 1);
    }
}
