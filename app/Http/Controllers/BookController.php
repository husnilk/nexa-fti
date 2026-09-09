<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookStoreRequest;
use App\Http\Requests\BookUpdateRequest;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:book.view')->only(['index', 'show']);
        $this->middleware('permission:book.manage')->except(['index', 'show']);
    }

    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $books = Book::with('authors')
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return Inertia::render('books/index', [
            'books' => $books,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('books/create', [
            'users' => $users,
        ]);
    }

    public function store(BookStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $book = Book::create($validated);
        $book->authors()->attach($validated['authors']);

        return redirect()->route('books.index')->with('success', 'Book created successfully.');
    }

    public function show(Book $book): Response
    {
        $book->load('authors');

        return Inertia::render('books/show', [
            'book' => $book,
        ]);
    }

    public function edit(Book $book): Response
    {
        $book->load('authors');
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('books/edit', [
            'book' => $book,
            'users' => $users,
        ]);
    }

    public function update(BookUpdateRequest $request, Book $book): RedirectResponse
    {
        $validated = $request->validated();

        $book->update($validated);
        $book->authors()->sync($validated['authors']);

        return redirect()->route('books.index')->with('success', 'Book updated successfully.');
    }

    public function destroy(Book $book): RedirectResponse
    {
        $book->delete();

        return redirect()->route('books.index')->with('success', 'Book deleted successfully.');
    }
}
