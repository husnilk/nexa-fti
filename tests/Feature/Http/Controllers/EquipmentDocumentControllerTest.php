<?php

namespace Tests\Feature\Http\Controllers;

use App\Http\Controllers\EquipmentDocumentController;
use App\Http\Requests\EquipmentDocumentControllerStoreRequest;
use App\Http\Requests\EquipmentDocumentControllerUpdateRequest;
use App\Models\Employee;
use App\Models\Equipment;
use App\Models\EquipmentDocument;
use App\Models\UploadedBy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see EquipmentDocumentController
 */
final class EquipmentDocumentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_displays_view(): void
    {
        $equipmentDocuments = EquipmentDocument::factory()->count(3)->create();

        $response = $this->get(route('equipment-documents.index'));

        $response->assertOk();
        $response->assertViewIs('equipmentDocument.index');
        $response->assertViewHas('equipmentDocuments', $equipmentDocuments);
    }

    #[Test]
    public function create_displays_view(): void
    {
        $response = $this->get(route('equipment-documents.create'));

        $response->assertOk();
        $response->assertViewIs('equipmentDocument.create');
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDocumentController::class,
            'store',
            EquipmentDocumentControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_and_redirects(): void
    {
        $equipment = Equipment::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(/** enum_attributes **/);
        $file_path = fake()->word();
        $uploaded_by = UploadedBy::factory()->create();
        $uploaded_at = Carbon::parse(fake()->dateTime());
        $uploaded_by = Employee::factory()->create();

        $response = $this->post(route('equipment-documents.store'), [
            'equipment_id' => $equipment->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'uploaded_by_id' => $uploaded_by->id,
        ]);

        $equipmentDocuments = EquipmentDocument::query()
            ->where('equipment_id', $equipment->id)
            ->where('title', $title)
            ->where('document_type', $document_type)
            ->where('file_path', $file_path)
            ->where('uploaded_by', $uploaded_by->id)
            ->where('uploaded_at', $uploaded_at)
            ->where('uploaded_by_id', $uploaded_by->id)
            ->get();
        $this->assertCount(1, $equipmentDocuments);
        $equipmentDocument = $equipmentDocuments->first();

        $response->assertRedirect(route('equipmentDocuments.index'));
        $response->assertSessionHas('equipmentDocument.id', $equipmentDocument->id);
    }

    #[Test]
    public function show_displays_view(): void
    {
        $equipmentDocument = EquipmentDocument::factory()->create();

        $response = $this->get(route('equipment-documents.show', $equipmentDocument));

        $response->assertOk();
        $response->assertViewIs('equipmentDocument.show');
        $response->assertViewHas('equipmentDocument', $equipmentDocument);
    }

    #[Test]
    public function edit_displays_view(): void
    {
        $equipmentDocument = EquipmentDocument::factory()->create();

        $response = $this->get(route('equipment-documents.edit', $equipmentDocument));

        $response->assertOk();
        $response->assertViewIs('equipmentDocument.edit');
        $response->assertViewHas('equipmentDocument', $equipmentDocument);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            EquipmentDocumentController::class,
            'update',
            EquipmentDocumentControllerUpdateRequest::class
        );
    }

    #[Test]
    public function update_redirects(): void
    {
        $equipmentDocument = EquipmentDocument::factory()->create();
        $equipment = Equipment::factory()->create();
        $title = fake()->sentence(4);
        $document_type = fake()->randomElement(/** enum_attributes **/);
        $file_path = fake()->word();
        $uploaded_by = UploadedBy::factory()->create();
        $uploaded_at = Carbon::parse(fake()->dateTime());
        $uploaded_by = Employee::factory()->create();

        $response = $this->put(route('equipment-documents.update', $equipmentDocument), [
            'equipment_id' => $equipment->id,
            'title' => $title,
            'document_type' => $document_type,
            'file_path' => $file_path,
            'uploaded_by' => $uploaded_by->id,
            'uploaded_at' => $uploaded_at->toDateTimeString(),
            'uploaded_by_id' => $uploaded_by->id,
        ]);

        $equipmentDocument->refresh();

        $response->assertRedirect(route('equipmentDocuments.index'));
        $response->assertSessionHas('equipmentDocument.id', $equipmentDocument->id);

        $this->assertEquals($equipment->id, $equipmentDocument->equipment_id);
        $this->assertEquals($title, $equipmentDocument->title);
        $this->assertEquals($document_type, $equipmentDocument->document_type);
        $this->assertEquals($file_path, $equipmentDocument->file_path);
        $this->assertEquals($uploaded_by->id, $equipmentDocument->uploaded_by);
        $this->assertEquals($uploaded_at->timestamp, $equipmentDocument->uploaded_at);
        $this->assertEquals($uploaded_by->id, $equipmentDocument->uploaded_by_id);
    }

    #[Test]
    public function destroy_deletes_and_redirects(): void
    {
        $equipmentDocument = EquipmentDocument::factory()->create();

        $response = $this->delete(route('equipment-documents.destroy', $equipmentDocument));

        $response->assertRedirect(route('equipmentDocuments.index'));

        $this->assertModelMissing($equipmentDocument);
    }
}
