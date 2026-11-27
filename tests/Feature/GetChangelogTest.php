<?php

use App\Actions\GetChangelog;
use Inertia\Testing\AssertableInertia as Assert;

function writeChangelog(string $contents): string
{
    $path = tempnam(sys_get_temp_dir(), 'changelog');
    file_put_contents($path, $contents);

    return $path;
}

test('it parses released versions and skips unreleased and empty releases', function () {
    $path = writeChangelog(<<<'MD'
        # Changelog

        ## [Unreleased]

        ### Added
        - Not yet released.

        ## [1.1.0] - 2026-09-24

        ### Added
        - New **inventory** [variants](https://example.com) and `pictures`.

        ### Fixed

        ## [1.0.1] - 2026-07-01

        ## [1.0.0] - 2026-06-10

        ### Changed
        * Initial release.
        MD);

    expect((new GetChangelog)->handle($path))->toBe([
        [
            'version' => '1.1.0',
            'date' => '2026-09-24',
            'sections' => [
                ['type' => 'Added', 'items' => ['New inventory variants and pictures.']],
            ],
        ],
        [
            'version' => '1.0.0',
            'date' => '2026-06-10',
            'sections' => [
                ['type' => 'Changed', 'items' => ['Initial release.']],
            ],
        ],
    ]);
});

test('it limits the number of releases', function () {
    $path = writeChangelog(collect(range(1, 4))
        ->map(fn (int $minor): string => "## [1.{$minor}.0] - 2026-06-0{$minor}\n### Added\n- Change {$minor}.\n")
        ->implode("\n"));

    expect((new GetChangelog)->handle($path, limit: 2))
        ->toHaveCount(2)
        ->sequence(
            fn ($release) => $release->version->toBe('1.1.0'),
            fn ($release) => $release->version->toBe('1.2.0'),
        );
});

test('it returns an empty list when the changelog file is missing', function () {
    expect((new GetChangelog)->handle('/path/that/does/not/exist.md'))->toBe([]);
});

test('login screen receives the changelog', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->has('changelog.0', fn (Assert $release) => $release
                ->has('version')
                ->has('date')
                ->has('sections.0.items.0')
            )
        );
});
