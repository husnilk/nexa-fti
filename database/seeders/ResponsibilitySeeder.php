<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\PositionResponsibility;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ResponsibilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $responsibilities = [
            'Rektor' => [
                [
                    'title' => 'Menetapkan arah strategis universitas',
                    'description' => 'Memimpin penyusunan dan pelaksanaan kebijakan strategis universitas.',
                    'type' => 'primary',
                    'order' => 1,
                ],
                [
                    'title' => 'Mengawasi tata kelola universitas',
                    'description' => 'Memastikan tata kelola universitas berjalan efektif, akuntabel, dan sesuai regulasi.',
                    'type' => 'primary',
                    'order' => 2,
                ],
            ],
            'Wakil Rektor Bidang Akademik' => [
                [
                    'title' => 'Mengkoordinasikan kebijakan akademik',
                    'description' => 'Mengelola perencanaan, pelaksanaan, dan evaluasi kebijakan akademik.',
                    'type' => 'primary',
                    'order' => 1,
                ],
                [
                    'title' => 'Meningkatkan mutu pembelajaran',
                    'description' => 'Mendorong peningkatan kualitas kurikulum, pembelajaran, dan evaluasi akademik.',
                    'type' => 'secondary',
                    'order' => 2,
                ],
            ],
            'Dekan' => [
                [
                    'title' => 'Memimpin penyelenggaraan fakultas',
                    'description' => 'Mengelola kegiatan pendidikan, penelitian, dan pengabdian masyarakat di tingkat fakultas.',
                    'type' => 'primary',
                    'order' => 1,
                ],
                [
                    'title' => 'Mengawasi kinerja program studi',
                    'description' => 'Memastikan program studi menjalankan kegiatan akademik sesuai standar mutu.',
                    'type' => 'secondary',
                    'order' => 2,
                ],
            ],
            'Ketua Program Studi' => [
                [
                    'title' => 'Mengelola operasional program studi',
                    'description' => 'Mengatur kegiatan akademik dan administrasi pada program studi.',
                    'type' => 'primary',
                    'order' => 1,
                ],
                [
                    'title' => 'Mengevaluasi kurikulum program studi',
                    'description' => 'Melakukan evaluasi dan pengembangan kurikulum sesuai kebutuhan akademik dan industri.',
                    'type' => 'secondary',
                    'order' => 2,
                ],
            ],
        ];

        foreach ($responsibilities as $positionName => $items) {
            $position = Position::query()->where('name', $positionName)->first();

            if (! $position) {
                continue;
            }

            foreach ($items as $item) {
                PositionResponsibility::query()->updateOrCreate(
                    [
                        'position_id' => $position->id,
                        'title' => $item['title'],
                    ],
                    [
                        'id' => (string) Str::uuid(),
                        'description' => $item['description'],
                        'type' => $item['type'],
                        'order' => $item['order'],
                    ],
                );
            }
        }
    }
}
