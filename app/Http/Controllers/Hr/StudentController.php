<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Lecturer;
use App\Models\Organization;
use App\Models\Role;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:students.view')->only(['index', 'show']);
        $this->middleware('permission:students.manage')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $search = request('search');

        return Inertia::render('students/index', [
            'students' => Student::query()
                ->with(['department', 'advisor.employee'])
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('reg_no', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->latest()
                ->get(),
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('students/create', [
            'departments' => Organization::all(),
            'advisors' => Lecturer::with('employee')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make('password'), // Default password
                'is_active' => true,
            ]);

            $user->assignRole(Role::findOrCreate('user', 'web'));

            $data = $request->validated();
            $data['id'] = $user->id;

            if ($request->hasFile('photo')) {
                $data['photo'] = $request->file('photo')->store('student/photos', 'public');
            }

            Student::create($data);
        });

        return redirect()->route('students.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student): Response
    {
        return Inertia::render('students/show', [
            'student' => $student->load(['user', 'department', 'advisor.employee']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student): Response
    {
        return Inertia::render('students/edit', [
            'student' => $student,
            'departments' => Organization::all(),
            'advisors' => Lecturer::with('employee')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
    {
        DB::transaction(function () use ($request, $student) {
            $data = $request->validated();

            if ($request->hasFile('photo')) {
                if ($student->photo) {
                    Storage::disk('public')->delete($student->photo);
                }
                $data['photo'] = $request->file('photo')->store('student/photos', 'public');
            }

            $student->update($data);
            $student->user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);
        });

        return redirect()->route('students.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student): RedirectResponse
    {
        DB::transaction(function () use ($student) {
            if ($student->photo) {
                Storage::disk('public')->delete($student->photo);
            }
            $student->user->delete(); // Cascades to student
        });

        return redirect()->route('students.index');
    }
}
