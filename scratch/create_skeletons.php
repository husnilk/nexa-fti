<?php

$baseDir = __DIR__.'/../resources/js/pages/committees';

$subResources = [
    'members',
    'tasks',
    'task-progresses',
    'budgets',
    'budget-items',
    'expenses',
    'expense-items',
    'documents',
    'progresses',
];

$views = ['index', 'create', 'show', 'edit'];

// Create base committees directory and views
if (! is_dir($baseDir)) {
    mkdir($baseDir, 0755, true);
}

foreach ($views as $view) {
    $filePath = "{$baseDir}/{$view}.tsx";
    if (! file_exists($filePath)) {
        file_put_contents($filePath, "import React from 'react';\n\nexport default function Page() {\n    return <div>Committee {$view}</div>;\n}\n");
    }
}

// Create sub-resource directories and views
foreach ($subResources as $sub) {
    $dir = "{$baseDir}/{$sub}";
    if (! is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    foreach ($views as $view) {
        $filePath = "{$dir}/{$view}.tsx";
        if (! file_exists($filePath)) {
            file_put_contents($filePath, "import React from 'react';\n\nexport default function Page() {\n    return <div>Committee {$sub} {$view}</div>;\n}\n");
        }
    }
}

echo "All skeletons created successfully!\n";
