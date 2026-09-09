<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected array $organizationTypes = [
        ['name' => 'Rektorat', 'level' => 1],
        ['name' => 'Direktorat', 'level' => 2],
        ['name' => 'Lembaga', 'level' => 2],
        ['name' => 'UPT', 'level' => 2],
        ['name' => 'Fakultas', 'level' => 2],
        ['name' => 'Departemen', 'level' => 3],
        ['name' => 'Bagian', 'level' => 3],
        ['name' => 'Prodi', 'level' => 4],
        ['name' => 'Lainnya', 'level' => 99],
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('organizations', 'type')) {
            return;
        }

        $timestamp = now();
        $existingTypes = DB::table('organization_types')
            ->pluck('id', 'name')
            ->all();

        foreach ($this->organizationTypes as $organizationType) {
            if (! array_key_exists($organizationType['name'], $existingTypes)) {
                $id = (string) str()->uuid();

                DB::table('organization_types')->insert([
                    'id' => $id,
                    'name' => $organizationType['name'],
                    'level' => $organizationType['level'],
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]);

                $existingTypes[$organizationType['name']] = $id;
            }
        }

        DB::table('organizations')
            ->select(['id', 'type'])
            ->orderBy('id')
            ->get()
            ->each(function (object $organization) use ($existingTypes): void {
                if (! isset($existingTypes[$organization->type])) {
                    return;
                }

                DB::table('organizations')
                    ->where('id', $organization->id)
                    ->update([
                        'organization_type_id' => $existingTypes[$organization->type],
                    ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('organizations', 'type')) {
            return;
        }

        $organizationTypeNames = DB::table('organization_types')
            ->pluck('name', 'id')
            ->all();

        DB::table('organizations')
            ->select(['id', 'organization_type_id'])
            ->orderBy('id')
            ->get()
            ->each(function (object $organization) use ($organizationTypeNames): void {
                $typeName = $organizationTypeNames[$organization->organization_type_id] ?? 'Lainnya';

                DB::table('organizations')
                    ->where('id', $organization->id)
                    ->update([
                        'type' => $typeName,
                    ]);
            });
    }
};
