<?php

use App\Http\Controllers\Academic\CommunityServiceController;
use App\Http\Controllers\Academic\CommunityServiceMemberController;
use App\Http\Controllers\Academic\PublicationAuthorController;
use App\Http\Controllers\Academic\PublicationController;
use App\Http\Controllers\Academic\ResearchController;
use App\Http\Controllers\Academic\ResearchMemberController;
use App\Http\Controllers\Acl\EmployeeTypeController;
use App\Http\Controllers\Acl\EmploymentContractController;
use App\Http\Controllers\Acl\EmploymentTypeController;
use App\Http\Controllers\Acl\FunctionalPositionController;
use App\Http\Controllers\Acl\OrganizationController;
use App\Http\Controllers\Acl\OrganizationPositionController;
use App\Http\Controllers\Acl\OrganizationTypeController;
use App\Http\Controllers\Acl\PermissionController;
use App\Http\Controllers\Acl\PositionController;
use App\Http\Controllers\Acl\PositionNomenclatureClassificationController;
use App\Http\Controllers\Acl\PositionNomenclatureController;
use App\Http\Controllers\Acl\PositionNomenclatureResponsibilityController;
use App\Http\Controllers\Acl\PositionResponsibilityController;
use App\Http\Controllers\Acl\RoleController;
use App\Http\Controllers\Acl\UserController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetGrantController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AssignmentProgressController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\CommitteeBudgetController;
use App\Http\Controllers\CommitteeBudgetItemController;
use App\Http\Controllers\CommitteeController;
use App\Http\Controllers\CommitteeDocumentController;
use App\Http\Controllers\CommitteeExpenseController;
use App\Http\Controllers\CommitteeExpenseItemController;
use App\Http\Controllers\CommitteeMemberController;
use App\Http\Controllers\CommitteeProgressController;
use App\Http\Controllers\CommitteeTaskController;
use App\Http\Controllers\CommitteeTaskProgressController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentRevisionController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\EquipmentAuditController;
use App\Http\Controllers\EquipmentCategoryController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentDepreciationController;
use App\Http\Controllers\EquipmentDisposalController;
use App\Http\Controllers\EquipmentDistributionController;
use App\Http\Controllers\EquipmentDocumentController;
use App\Http\Controllers\EquipmentMaintenanceActivityController;
use App\Http\Controllers\EquipmentMaintenanceRequestController;
use App\Http\Controllers\EquipmentModelController;
use App\Http\Controllers\EquipmentProcurementController;
use App\Http\Controllers\EquipmentReceiptController;
use App\Http\Controllers\EquipmentUsageApprovalController;
use App\Http\Controllers\EquipmentUsageController;
use App\Http\Controllers\EventAttendanceController;
use App\Http\Controllers\EventCommitteeMemberController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventDocumentController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\EventReminderController;
use App\Http\Controllers\Hr\EmployeeAttendanceController;
use App\Http\Controllers\Hr\EmployeeAttendanceReportController;
use App\Http\Controllers\Hr\EmployeeCertificationController;
use App\Http\Controllers\Hr\EmployeeController;
use App\Http\Controllers\Hr\EmployeeEducationHistoryController;
use App\Http\Controllers\Hr\EmployeeFamilyMemberController;
use App\Http\Controllers\Hr\EmployeePositionHistoryController;
use App\Http\Controllers\Hr\EmployeeRankController;
use App\Http\Controllers\Hr\EmployeeRankHistoryController;
use App\Http\Controllers\Hr\HolidayController;
use App\Http\Controllers\Hr\LeaveRequestController;
use App\Http\Controllers\Hr\LeaveTypeController;
use App\Http\Controllers\Hr\NomenclatureClassificationHistoryController;
use App\Http\Controllers\Hr\OvertimeRequestController;
use App\Http\Controllers\Hr\PositionFunctionalHistoryController;
use App\Http\Controllers\Hr\StudentController;
use App\Http\Controllers\Hr\TrainingController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\InventoryIssueController;
use App\Http\Controllers\Inventory\InventoryProcurementController;
use App\Http\Controllers\Inventory\InventoryReceiptController;
use App\Http\Controllers\Inventory\InventoryRequestController;
use App\Http\Controllers\Inventory\ItemCategoryController;
use App\Http\Controllers\Inventory\ItemController;
use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\LeaveApprovalController;
use App\Http\Controllers\MeetingActionItemController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingDocumentController;
use App\Http\Controllers\MeetingExternalParticipantController;
use App\Http\Controllers\MeetingMinuteController;
use App\Http\Controllers\MeetingParticipantController;
use App\Http\Controllers\MeetingRefreshmentItemController;
use App\Http\Controllers\MeetingRefreshmentRequestController;
use App\Http\Controllers\OvertimeApprovalController;
use App\Http\Controllers\PersonalLeaveRequestController;
use App\Http\Controllers\PersonalOvertimeRequestController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomMaintenanceRequestController;
use App\Http\Controllers\RoomMaintenanceRequestFileController;
use App\Http\Controllers\RoomMaintenanceRequestLogController;
use App\Http\Controllers\RoomMaintenanceRequestLogFileController;
use App\Http\Controllers\RoomUsageController;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

if (config('app.debug')) {
    Route::post('/login-admin', function () {
        $user = User::role('super-admin')->first();

        if ($user) {
            Auth::login($user);

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors(['message' => 'Super Admin not found.']);
    })->name('login-admin');

    Route::post('/login-as/{user}', function ($userId) {
        $user = User::findOrFail($userId);
        Auth::login($user);

        return redirect()->intended(route('dashboard'));
    })->name('login-as');
}

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->middleware('permission:dashboard.view')->name('dashboard');

    Route::resource('users', UserController::class);
    Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
        ->name('users.toggle-status');

    Route::resource('organizations', OrganizationController::class)
        ->only(['index'])
        ->middleware('permission:organization.view');
    Route::get('organizations/structure', function () {
        return Inertia::render('organizations/structure', [
            'organizations' => Organization::query()
                ->with('organizationType:id,name,level')
                ->orderBy('name')
                ->get(),
        ]);
    })->middleware('permission:organization.view')->name('organizations.structure');
    Route::resource('organizations', OrganizationController::class)
        ->only(['show'])
        ->middleware('permission:organization.view');
    Route::resource('organizations', OrganizationController::class)
        ->only(['store', 'update', 'destroy'])
        ->middleware('permission:organization.manage');
    Route::resource('organization-positions', OrganizationPositionController::class)
        ->only(['store', 'update', 'destroy'])
        ->middleware('permission:organization.manage');
    Route::resource('organization-types', OrganizationTypeController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('permission:organization.manage');

    Route::get('positions/organization-positions', [PositionController::class, 'organizationPositions'])
        ->name('positions.organization-positions');
    Route::resource('positions', PositionController::class);
    Route::post('position-responsibilities', [PositionResponsibilityController::class, 'store'])->name('position-responsibilities.store');
    Route::patch('position-responsibilities/{responsibility}', [PositionResponsibilityController::class, 'update'])->name('position-responsibilities.update');
    Route::delete('position-responsibilities/{responsibility}', [PositionResponsibilityController::class, 'destroy'])->name('position-responsibilities.destroy');

    Route::resource('position-nomenclatures', PositionNomenclatureController::class);
    Route::resource('functional-positions', FunctionalPositionController::class);

    Route::resource('employee-types', EmployeeTypeController::class);
    Route::resource('employment-contracts', EmploymentContractController::class);
    Route::resource('employment-types', EmploymentTypeController::class);

    Route::resource('employees', EmployeeController::class);
    Route::resource('students', StudentController::class);
    Route::get('employee-attendances/reports', [EmployeeAttendanceReportController::class, 'index'])
        ->name('employee-attendances.reports.index');
    Route::get('employee-attendances/reports/{employee}', [EmployeeAttendanceReportController::class, 'show'])
        ->name('employee-attendances.reports.show');
    Route::resource('employee-attendances', EmployeeAttendanceController::class);
    Route::resource('holidays', HolidayController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

    Route::resource('leave-types', LeaveTypeController::class);
    Route::resource('employee-ranks', EmployeeRankController::class);
    Route::resource('leave-requests', LeaveRequestController::class);
    Route::post('leave-requests/{leave_request}/approve', [LeaveRequestController::class, 'approve'])->name('leave-requests.approve');
    Route::post('leave-requests/{leave_request}/reject', [LeaveRequestController::class, 'reject'])->name('leave-requests.reject');
    Route::resource('personal-leave-requests', PersonalLeaveRequestController::class)->only(['index', 'create', 'store', 'show']);
    Route::resource('personal-overtime-requests', PersonalOvertimeRequestController::class);
    Route::get('personal-overtime-requests/{personal_overtime_request}/report', [PersonalOvertimeRequestController::class, 'report'])->name('personal-overtime-requests.report');
    Route::post('personal-overtime-requests/{personal_overtime_request}/complete', [PersonalOvertimeRequestController::class, 'complete'])->name('personal-overtime-requests.complete');
    Route::get('personal-overtime-requests/{personal_overtime_request}/my-report', [PersonalOvertimeRequestController::class, 'myReport'])->name('personal-overtime-requests.my-report');
    Route::post('personal-overtime-requests/{personal_overtime_request}/my-report', [PersonalOvertimeRequestController::class, 'storeMyReport'])->name('personal-overtime-requests.store-my-report');

    Route::middleware('permission:leave.approval')->group(function () {
        Route::get('leave-approvals', [LeaveApprovalController::class, 'index'])->name('leave-approvals.index');
        Route::get('leave-approvals/{leave_request}', [LeaveApprovalController::class, 'show'])->name('leave-approvals.show');
        Route::post('leave-approvals/{leave_request}/approve', [LeaveApprovalController::class, 'approve'])->name('leave-approvals.approve');
        Route::post('leave-approvals/{leave_request}/reject', [LeaveApprovalController::class, 'reject'])->name('leave-approvals.reject');
    });

    Route::middleware('permission:overtime.approval')->group(function () {
        Route::get('overtime-approvals', [OvertimeApprovalController::class, 'index'])->name('overtime-approvals.index');
        Route::get('overtime-approvals/{overtime_request}', [OvertimeApprovalController::class, 'show'])->name('overtime-approvals.show');
        Route::post('overtime-approvals/{overtime_request}/approve', [OvertimeApprovalController::class, 'approve'])->name('overtime-approvals.approve');
        Route::post('overtime-approvals/{overtime_request}/reject', [OvertimeApprovalController::class, 'reject'])->name('overtime-approvals.reject');
    });

    Route::resource('overtime-requests', OvertimeRequestController::class);
    Route::resource('trainings', TrainingController::class);
    Route::resource('certifications', CertificationController::class);
    Route::post('overtime-requests/{overtime_request}/approve', [OvertimeRequestController::class, 'approve'])->name('overtime-requests.approve');
    Route::post('overtime-requests/{overtime_request}/reject', [OvertimeRequestController::class, 'reject'])->name('overtime-requests.reject');

    Route::post('employee-position-histories', [EmployeePositionHistoryController::class, 'store'])->name('employee-position-histories.store');
    Route::patch('employee-position-histories/{history}', [EmployeePositionHistoryController::class, 'update'])->name('employee-position-histories.update');
    Route::delete('employee-position-histories/{history}', [EmployeePositionHistoryController::class, 'destroy'])->name('employee-position-histories.destroy');

    Route::post('employee-education-histories', [EmployeeEducationHistoryController::class, 'store'])->name('employee-education-histories.store');
    Route::patch('employee-education-histories/{history}', [EmployeeEducationHistoryController::class, 'update'])->name('employee-education-histories.update');
    Route::delete('employee-education-histories/{history}', [EmployeeEducationHistoryController::class, 'destroy'])->name('employee-education-histories.destroy');

    Route::post('employee-certifications', [EmployeeCertificationController::class, 'store'])->name('employee-certifications.store');
    Route::patch('employee-certifications/{employeeCertification}', [EmployeeCertificationController::class, 'update'])->name('employee-certifications.update');
    Route::delete('employee-certifications/{employeeCertification}', [EmployeeCertificationController::class, 'destroy'])->name('employee-certifications.destroy');

    Route::post('position-functional-histories', [PositionFunctionalHistoryController::class, 'store'])->name('position-functional-histories.store');
    Route::patch('position-functional-histories/{history}', [PositionFunctionalHistoryController::class, 'update'])->name('position-functional-histories.update');
    Route::delete('position-functional-histories/{history}', [PositionFunctionalHistoryController::class, 'destroy'])->name('position-functional-histories.destroy');

    Route::post('nomenclature-classification-histories', [NomenclatureClassificationHistoryController::class, 'store'])->name('nomenclature-classification-histories.store');
    Route::patch('nomenclature-classification-histories/{history}', [NomenclatureClassificationHistoryController::class, 'update'])->name('nomenclature-classification-histories.update');
    Route::delete('nomenclature-classification-histories/{history}', [NomenclatureClassificationHistoryController::class, 'destroy'])->name('nomenclature-classification-histories.destroy');

    Route::post('employee-family-members', [EmployeeFamilyMemberController::class, 'store'])->name('employee-family-members.store');
    Route::patch('employee-family-members/{familyMember}', [EmployeeFamilyMemberController::class, 'update'])->name('employee-family-members.update');
    Route::delete('employee-family-members/{familyMember}', [EmployeeFamilyMemberController::class, 'destroy'])->name('employee-family-members.destroy');

    Route::post('employee-rank-histories', [EmployeeRankHistoryController::class, 'store'])->name('employee-rank-histories.store');
    Route::patch('employee-rank-histories/{rankHistory}', [EmployeeRankHistoryController::class, 'update'])->name('employee-rank-histories.update');
    Route::delete('employee-rank-histories/{rankHistory}', [EmployeeRankHistoryController::class, 'destroy'])->name('employee-rank-histories.destroy');

    Route::post('position-nomenclature-responsibilities', [PositionNomenclatureResponsibilityController::class, 'store'])->name('position-nomenclature-responsibilities.store');

    Route::patch('position-nomenclature-responsibilities/{responsibility}', [PositionNomenclatureResponsibilityController::class, 'update'])->name('position-nomenclature-responsibilities.update');
    Route::delete('position-nomenclature-responsibilities/{responsibility}', [PositionNomenclatureResponsibilityController::class, 'destroy'])->name('position-nomenclature-responsibilities.destroy');

    Route::post('position-nomenclature-classifications', [PositionNomenclatureClassificationController::class, 'store'])->name('position-nomenclature-classifications.store');
    Route::patch('position-nomenclature-classifications/{classification}', [PositionNomenclatureClassificationController::class, 'update'])->name('position-nomenclature-classifications.update');
    Route::delete('position-nomenclature-classifications/{classification}', [PositionNomenclatureClassificationController::class, 'destroy'])->name('position-nomenclature-classifications.destroy');

    Route::resource('roles', RoleController::class)
        ->except('show');

    Route::get('permissions', [PermissionController::class, 'index'])
        ->middleware('permission:account.view')
        ->name('permissions.index');
    Route::post('permissions', [PermissionController::class, 'store'])
        ->middleware('permission:account.manage')
        ->name('permissions.store');
    Route::patch('permissions/{permission}', [PermissionController::class, 'update'])
        ->middleware('permission:account.manage')
        ->name('permissions.update');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])
        ->middleware('permission:account.manage')
        ->name('permissions.destroy');

    Route::resource('research', ResearchController::class);
    Route::resource('research-members', ResearchMemberController::class);
    Route::resource('community-services', CommunityServiceController::class);
    Route::resource('community-service-members', CommunityServiceMemberController::class);
    Route::resource('publications', PublicationController::class);
    Route::resource('publication-authors', PublicationAuthorController::class);
    Route::resource('books', BookController::class);

    // Asset & Facilities Module
    Route::middleware('permission:room.view')->group(function () {
        Route::resource('buildings', BuildingController::class)->except(['create', 'edit']);
        Route::resource('rooms', RoomController::class);
        Route::resource('assets', AssetController::class);
        Route::resource('asset-grants', AssetGrantController::class);
        Route::resource('room-maintenance-request-files', RoomMaintenanceRequestFileController::class);
        Route::resource('room-maintenance-request-logs', RoomMaintenanceRequestLogController::class);
        Route::resource('room-maintenance-request-log-files', RoomMaintenanceRequestLogFileController::class)->parameters([
            'room-maintenance-request-log-files' => 'file',
        ]);
    });

    // Document Management Module
    Route::middleware('permission:document.view|document.manage')->group(function () {
        Route::resource('document-types', DocumentTypeController::class);
        Route::post('documents/{document}/publish', [DocumentController::class, 'publish'])->name('documents.publish');
        Route::post('documents/{document}/archive', [DocumentController::class, 'archive'])->name('documents.archive');
        Route::resource('documents', DocumentController::class);
        Route::resource('document-revisions', DocumentRevisionController::class);
    });

    Route::resource('room-maintenance-requests', RoomMaintenanceRequestController::class);
    Route::post('room-maintenance-requests/{room_maintenance_request}/respond', [RoomMaintenanceRequestController::class, 'respond'])->name('room-maintenance-requests.respond');
    Route::post('room-maintenance-requests/{room_maintenance_request}/log', [RoomMaintenanceRequestController::class, 'addLog'])->name('room-maintenance-requests.add-log');
    Route::post('room-maintenance-requests/{room_maintenance_request}/verify', [RoomMaintenanceRequestController::class, 'verify'])->name('room-maintenance-requests.verify');

    Route::get('room-usages/report', [RoomUsageController::class, 'report'])->name('room-usages.report');
    Route::resource('room-usages', RoomUsageController::class)->except(['edit', 'update']);
    Route::post('room-usages/{room_usage}/approve', [RoomUsageController::class, 'approve'])->name('room-usages.approve');
    Route::post('room-usages/{room_usage}/reject', [RoomUsageController::class, 'reject'])->name('room-usages.reject');

    // Inventory Module
    Route::prefix('inventory')->group(function () {
        Route::resource('categories', ItemCategoryController::class)
            ->names('inventory-categories');
        Route::resource('items', ItemController::class)
            ->names('inventory-items');
        Route::resource('warehouses', WarehouseController::class)
            ->names('inventory-warehouses');
        Route::get('stock', [InventoryController::class, 'index'])
            ->name('inventory.stock');

        Route::resource('procurements', InventoryProcurementController::class)
            ->names('inventory-procurements')
            ->parameters(['procurements' => 'inventory_procurement']);
        Route::post('procurements/{inventory_procurement}/approve', [InventoryProcurementController::class, 'approve'])
            ->name('inventory-procurements.approve');
        Route::post('procurements/{inventory_procurement}/reject', [InventoryProcurementController::class, 'reject'])
            ->name('inventory-procurements.reject');

        Route::resource('receipts', InventoryReceiptController::class)
            ->names('inventory-receipts');

        Route::resource('requests', InventoryRequestController::class)
            ->names('inventory-requests')
            ->parameters(['requests' => 'inventory_request']);
        Route::post('requests/{inventory_request}/approve', [InventoryRequestController::class, 'approve'])
            ->name('inventory-requests.approve');
        Route::post('requests/{inventory_request}/reject', [InventoryRequestController::class, 'reject'])
            ->name('inventory-requests.reject');

        Route::resource('issues', InventoryIssueController::class)
            ->names('inventory-issues');
    });

    // Equipment Management Module
    Route::prefix('equipment-management')->group(function () {
        Route::middleware('permission:equipment.view')->group(function () {
            Route::resource('categories', EquipmentCategoryController::class)
                ->names('equipment-categories')
                ->parameters(['categories' => 'equipmentCategory'])
                ->only(['index', 'show']);
            Route::resource('models', EquipmentModelController::class)
                ->names('equipment-models')
                ->parameters(['models' => 'equipmentModel'])
                ->only(['index', 'show']);
            Route::resource('equipment', EquipmentController::class)
                ->names('equipment')
                ->parameters(['equipment' => 'equipment'])
                ->only(['index', 'show']);
            Route::resource('documents', EquipmentDocumentController::class)
                ->names('equipment-documents')
                ->parameters(['documents' => 'equipmentDocument'])
                ->only(['index', 'show']);
            Route::resource('procurements', EquipmentProcurementController::class)
                ->names('equipment-procurements')
                ->parameters(['procurements' => 'equipmentProcurement'])
                ->only(['index', 'show']);
            Route::resource('receipts', EquipmentReceiptController::class)
                ->names('equipment-receipts')
                ->parameters(['receipts' => 'equipmentReceipt'])
                ->only(['index', 'show']);
            Route::resource('maintenance-activities', EquipmentMaintenanceActivityController::class)
                ->names('equipment-maintenance-activities')
                ->parameters(['maintenance-activities' => 'equipmentMaintenanceActivity']);

            Route::post('usages/{equipmentUsage}/return', [EquipmentUsageController::class, 'return'])
                ->name('equipment-usages.return');

            Route::post('distributions/{equipmentDistribution}/accept', [EquipmentDistributionController::class, 'accept'])
                ->name('equipment-distributions.accept');
            Route::post('distributions/{equipmentDistribution}/reject', [EquipmentDistributionController::class, 'reject'])
                ->name('equipment-distributions.reject');
            Route::post('distributions/{equipmentDistribution}/return', [EquipmentDistributionController::class, 'return'])
                ->name('equipment-distributions.return');

            Route::resource('audits', EquipmentAuditController::class)
                ->names('equipment-audits')
                ->parameters(['audits' => 'equipmentAudit'])
                ->only(['index', 'show']);
            Route::resource('depreciations', EquipmentDepreciationController::class)
                ->names('equipment-depreciations')
                ->parameters(['depreciations' => 'equipmentDepreciation'])
                ->only(['index', 'show']);
        });

        Route::middleware('permission:equipment.manage')->group(function () {
            Route::resource('categories', EquipmentCategoryController::class)
                ->names('equipment-categories')
                ->parameters(['categories' => 'equipmentCategory'])
                ->except(['index', 'show']);
            Route::resource('models', EquipmentModelController::class)
                ->names('equipment-models')
                ->parameters(['models' => 'equipmentModel'])
                ->except(['index', 'show']);
            Route::resource('equipment', EquipmentController::class)
                ->names('equipment')
                ->parameters(['equipment' => 'equipment'])
                ->except(['index', 'show']);
            Route::resource('documents', EquipmentDocumentController::class)
                ->names('equipment-documents')
                ->parameters(['documents' => 'equipmentDocument'])
                ->except(['index', 'show']);
            Route::resource('procurements', EquipmentProcurementController::class)
                ->names('equipment-procurements')
                ->parameters(['procurements' => 'equipmentProcurement'])
                ->except(['index', 'show']);
            Route::post('procurements/{equipmentProcurement}/cancel', [EquipmentProcurementController::class, 'cancel'])
                ->name('equipment-procurements.cancel');
            Route::resource('receipts', EquipmentReceiptController::class)
                ->names('equipment-receipts')
                ->parameters(['receipts' => 'equipmentReceipt'])
                ->except(['index', 'show']);

            Route::resource('distributions', EquipmentDistributionController::class)
                ->names('equipment-distributions')
                ->parameters(['distributions' => 'equipmentDistribution']);
            Route::middleware('permission:equipment.maintenance-request|equipment.view|equipment.manage')->group(function () {
                Route::resource('maintenance-requests', EquipmentMaintenanceRequestController::class)
                    ->names('equipment-maintenance-requests')
                    ->parameters(['maintenance-requests' => 'equipment_maintenance_request']);
                Route::post('maintenance-requests/{equipment_maintenance_request}/respond', [EquipmentMaintenanceRequestController::class, 'respond'])
                    ->name('equipment-maintenance-requests.respond');
                Route::post('maintenance-requests/{equipment_maintenance_request}/activity', [EquipmentMaintenanceRequestController::class, 'addActivity'])
                    ->name('equipment-maintenance-requests.add-activity');
                Route::post('maintenance-requests/{equipment_maintenance_request}/verify', [EquipmentMaintenanceRequestController::class, 'verify'])
                    ->name('equipment-maintenance-requests.verify');
            });

            Route::post('usages/{equipmentUsage}/approve', [EquipmentUsageApprovalController::class, 'approve'])
                ->name('equipment-usages.approve');
            Route::post('usages/{equipmentUsage}/reject', [EquipmentUsageApprovalController::class, 'reject'])
                ->name('equipment-usages.reject');
        });

        Route::middleware('permission:equipment.borrow|equipment.manage')->group(function () {
            Route::resource('usages', EquipmentUsageController::class)
                ->names('equipment-usages')
                ->parameters(['usages' => 'equipmentUsage'])
                ->only(['index', 'show', 'create', 'store', 'edit', 'update', 'destroy']);
        });

        Route::middleware('permission:equipment.manage')->group(function () {
            Route::resource('audits', EquipmentAuditController::class)
                ->names('equipment-audits')
                ->parameters(['audits' => 'equipmentAudit'])
                ->except(['index', 'show']);
            Route::resource('depreciations', EquipmentDepreciationController::class)
                ->names('equipment-depreciations')
                ->parameters(['depreciations' => 'equipmentDepreciation'])
                ->except(['index', 'show']);
        });

        Route::resource('disposals', EquipmentDisposalController::class)
            ->names('equipment-disposals')
            ->parameters(['disposals' => 'equipmentDisposal'])
            ->except(['index', 'show'])
            ->middleware('permission:equipment.disposal-manage');

        Route::resource('disposals', EquipmentDisposalController::class)
            ->names('equipment-disposals')
            ->parameters(['disposals' => 'equipmentDisposal'])
            ->only(['index', 'show'])
            ->middleware('permission:equipment.disposal-view');
    });

    Route::middleware('permission:committee.manage')->group(function () {
        Route::resource('committees', CommitteeController::class)->except(['index', 'show']);
        Route::resource('committee-members', CommitteeMemberController::class)->except(['index', 'show']);
        Route::resource('committee-tasks', CommitteeTaskController::class)->except(['index', 'show']);
        Route::resource('committee-task-progresses', CommitteeTaskProgressController::class)->except(['index', 'show']);
        Route::resource('committee-progresses', CommitteeProgressController::class)->except(['index', 'show']);
        Route::resource('committee-budgets', CommitteeBudgetController::class)->except(['index', 'show']);
        Route::resource('committee-budget-items', CommitteeBudgetItemController::class)->except(['index', 'show']);
        Route::resource('committee-expenses', CommitteeExpenseController::class)->except(['index', 'show']);
        Route::resource('committee-expense-items', CommitteeExpenseItemController::class)->except(['index', 'show']);
        Route::resource('committee-documents', CommitteeDocumentController::class)->except(['index', 'show']);
    });

    Route::middleware('permission:committee.view')->group(function () {
        Route::resource('committees', CommitteeController::class)->only(['index', 'show']);
        Route::resource('committee-members', CommitteeMemberController::class)->only(['index', 'show']);
        Route::resource('committee-tasks', CommitteeTaskController::class)->only(['index', 'show']);
        Route::resource('committee-task-progresses', CommitteeTaskProgressController::class)->only(['index', 'show']);
        Route::resource('committee-progresses', CommitteeProgressController::class)->only(['index', 'show']);
        Route::resource('committee-budgets', CommitteeBudgetController::class)->only(['index', 'show']);
        Route::resource('committee-budget-items', CommitteeBudgetItemController::class)->only(['index', 'show']);
        Route::resource('committee-expenses', CommitteeExpenseController::class)->only(['index', 'show']);
        Route::resource('committee-expense-items', CommitteeExpenseItemController::class)->only(['index', 'show']);
        Route::resource('committee-documents', CommitteeDocumentController::class)->only(['index', 'show']);
    });
});

require __DIR__.'/settings.php';

Route::resource('meetings', MeetingController::class);

Route::resource('meeting-participants', MeetingParticipantController::class);

Route::resource('meeting-external-participants', MeetingExternalParticipantController::class);

Route::resource('meeting-minutes', MeetingMinuteController::class);

Route::resource('meeting-documents', MeetingDocumentController::class);

Route::resource('meeting-refreshment-requests', MeetingRefreshmentRequestController::class);

Route::resource('meeting-refreshment-items', MeetingRefreshmentItemController::class);

Route::resource('meeting-action-items', MeetingActionItemController::class);

Route::resource('assignments', AssignmentController::class);

Route::resource('assignment-progresses', AssignmentProgressController::class);

Route::post('events/{event}/publish', [EventController::class, 'publish'])->name('events.publish');
Route::resource('events', EventController::class);

Route::resource('event-committee-members', EventCommitteeMemberController::class);

Route::resource('event-registrations', EventRegistrationController::class);

Route::resource('event-reminders', EventReminderController::class);

Route::resource('event-attendances', EventAttendanceController::class);

Route::resource('event-documents', EventDocumentController::class);
