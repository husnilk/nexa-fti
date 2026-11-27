<?php

use App\Models\Equipment;
use App\Models\EquipmentCategory;
use App\Models\EquipmentModel;
use Database\Seeders\EquipmentCategorySeeder;

test('equipment seeder populates real office equipment', function () {
    $this->seed(EquipmentCategorySeeder::class);

    foreach (['COMP', 'NET', 'AV', 'OFF', 'LAB'] as $code) {
        $category = EquipmentCategory::where('code', $code)->first();
        expect($category)->not->toBeNull();
        expect($category->equipmentModels()->count())->toBeGreaterThan(0);
    }

    $thinkpad = EquipmentModel::where('model_name', 'ThinkPad T14 Gen 4')->first();
    expect($thinkpad)->not->toBeNull();
    expect($thinkpad->manufacturer)->toBe('Lenovo');
    expect($thinkpad->equipmentCategory->code)->toBe('COMP');
    expect($thinkpad->equipment()->count())->toBe(3);

    $equipment = Equipment::where('equipment_number', 'FTI/COMP/2024/PF4T-01')->first();
    expect($equipment)->not->toBeNull();
    expect($equipment->equipmentModel->is($thinkpad))->toBeTrue();
    expect((float) $equipment->acquisition_cost)->toBe(22500000.0);
    expect((float) $equipment->residual_value)->toBe(2250000.0);
    expect($equipment->serial_number)->not->toBeEmpty();

    expect(Equipment::whereNull('serial_number')->count())->toBe(0);
    expect(Equipment::distinct()->pluck('status')->all())
        ->toContain('available', 'in_use', 'maintenance', 'disposed');
});

test('equipment seeder is idempotent', function () {
    $this->seed(EquipmentCategorySeeder::class);
    $counts = [EquipmentCategory::count(), EquipmentModel::count(), Equipment::count()];

    $this->seed(EquipmentCategorySeeder::class);

    expect([EquipmentCategory::count(), EquipmentModel::count(), Equipment::count()])->toBe($counts);
});
