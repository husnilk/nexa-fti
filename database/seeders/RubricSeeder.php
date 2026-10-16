<?php

namespace Database\Seeders;

use App\Models\EmploymentType;
use App\Models\Organization;
use App\Models\Rubric;
use App\Models\RubricCategory;
use App\Models\RubricRegulation;
use Illuminate\Database\Seeder;

class RubricSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regulation = RubricRegulation::create([
            'name' => 'Pedoman Remunerasi Fakultas Teknologi Informasi',
            'regulation_number' => '12',
            'regulation_year' => '2026',
            'description' => 'Rubrik penilaian kinerja untuk perhitungan remunerasi.',
        ]);

        $categories = collect([
            ['code' => 'PND', 'name' => 'Pendidikan', 'description' => 'Kegiatan pengajaran dan pembimbingan.'],
            ['code' => 'PNL', 'name' => 'Penelitian', 'description' => 'Kegiatan penelitian dan publikasi ilmiah.'],
            ['code' => 'PKM', 'name' => 'Pengabdian kepada Masyarakat', 'description' => 'Kegiatan pengabdian kepada masyarakat.'],
            ['code' => 'PNJ', 'name' => 'Penunjang', 'description' => 'Kegiatan penunjang tridharma.'],
        ])->mapWithKeys(fn (array $category) => [$category['code'] => RubricCategory::create($category)]);

        $rubrics = [
            ['PND', 'PND-01', 'Membimbing tugas akhir mahasiswa', 'mahasiswa', [['Pembimbing Utama', 2], ['Pembimbing Pendamping', 1]]],
            ['PND', 'PND-02', 'Menguji sidang tugas akhir', 'mahasiswa', [['Ketua Penguji', 1], ['Anggota Penguji', 0.5]]],
            ['PNL', 'PNL-01', 'Publikasi artikel di jurnal internasional bereputasi', 'artikel', [['Penulis Utama', 40], ['Penulis Anggota', 10]]],
            ['PNL', 'PNL-02', 'Ketua/anggota penelitian hibah eksternal', 'judul', [['Ketua', 20], ['Anggota', 8]]],
            ['PKM', 'PKM-01', 'Melaksanakan kegiatan pengabdian kepada masyarakat', 'kegiatan', [['Ketua', 10], ['Anggota', 5]]],
            ['PNJ', 'PNJ-01', 'Menjadi panitia kegiatan fakultas', 'kegiatan', [['Ketua', 4], ['Sekretaris', 3], ['Anggota', 2]]],
        ];

        $employmentTypeIds = EmploymentType::pluck('id');
        $organizationIds = Organization::pluck('id');

        foreach ($rubrics as [$categoryCode, $code, $activity, $unit, $details]) {
            $rubric = Rubric::factory()->create([
                'rubric_category_id' => $categories[$categoryCode]->id,
                'rubric_regulation_id' => $regulation->id,
                'code' => $code,
                'activity' => $activity,
                'quantity' => 1,
                'unit' => $unit,
            ]);

            foreach ($details as [$position, $poin]) {
                $rubric->details()->create(['position' => $position, 'poin' => $poin]);
            }

            foreach ($employmentTypeIds->random(min(3, $employmentTypeIds->count())) as $employmentTypeId) {
                $rubric->employmentTypes()->create(['employment_type_id' => $employmentTypeId]);
            }
        }

        // Restrict one rubric to a single organization to demonstrate assignments.
        if ($organizationIds->isNotEmpty()) {
            Rubric::where('code', 'PNJ-01')->first()
                ->organizations()->create(['organization_id' => $organizationIds->first()]);
        }
    }
}
