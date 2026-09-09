<?php

$dir = __DIR__.'/../tests/Feature/Http/Controllers';

// File 1: CommitteeBudgetItemControllerTest.php
$file = "{$dir}/CommitteeBudgetItemControllerTest.php";
if (file_exists($file)) {
    $content = file_get_contents($file);
    // Replace quantity, unit_price, total_amount
    $content = str_replace(
        '$quantity = fake()->randomFloat(/** decimal_attributes **/);',
        '$quantity = fake()->randomFloat(2, 1, 100);',
        $content
    );
    $content = str_replace(
        '$unit_price = fake()->randomFloat(/** decimal_attributes **/);',
        '$unit_price = fake()->randomFloat(2, 1, 1000);',
        $content
    );
    $content = str_replace(
        '$total_amount = fake()->randomFloat(/** decimal_attributes **/);',
        '$total_amount = fake()->randomFloat(2, 1, 10000);',
        $content
    );
    file_put_contents($file, $content);
}

// File 2: CommitteeExpenseItemControllerTest.php
$file = "{$dir}/CommitteeExpenseItemControllerTest.php";
if (file_exists($file)) {
    $content = file_get_contents($file);
    $content = str_replace(
        '$quantity = fake()->randomFloat(/** decimal_attributes **/);',
        '$quantity = fake()->randomFloat(2, 1, 100);',
        $content
    );
    $content = str_replace(
        '$unit_price = fake()->randomFloat(/** decimal_attributes **/);',
        '$unit_price = fake()->randomFloat(2, 1, 1000);',
        $content
    );
    $content = str_replace(
        '$total_amount = fake()->randomFloat(/** decimal_attributes **/);',
        '$total_amount = fake()->randomFloat(2, 1, 10000);',
        $content
    );
    file_put_contents($file, $content);
}

// File 3: CommitteeProgressControllerTest.php
$file = "{$dir}/CommitteeProgressControllerTest.php";
if (file_exists($file)) {
    $content = file_get_contents($file);
    $content = str_replace(
        '$progress_percentage = fake()->randomFloat(/** decimal_attributes **/);',
        '$progress_percentage = fake()->randomFloat(2, 0, 100);',
        $content
    );
    file_put_contents($file, $content);
}

// File 4: CommitteeTaskControllerTest.php
$file = "{$dir}/CommitteeTaskControllerTest.php";
if (file_exists($file)) {
    $content = file_get_contents($file);
    $content = str_replace(
        '$completion_percentage = fake()->randomFloat(/** decimal_attributes **/);',
        '$completion_percentage = fake()->randomFloat(2, 0, 100);',
        $content
    );
    file_put_contents($file, $content);
}

// File 5: CommitteeTaskProgressControllerTest.php
$file = "{$dir}/CommitteeTaskProgressControllerTest.php";
if (file_exists($file)) {
    $content = file_get_contents($file);
    $content = str_replace(
        '$progress_percentage = fake()->randomFloat(/** decimal_attributes **/);',
        '$progress_percentage = fake()->randomFloat(2, 0, 100);',
        $content
    );
    file_put_contents($file, $content);
}

echo "Test float replacements completed!\n";
