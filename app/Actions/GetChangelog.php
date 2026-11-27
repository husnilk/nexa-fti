<?php

namespace App\Actions;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class GetChangelog
{
    /**
     * Parse the latest released versions from a "Keep a Changelog" formatted file.
     *
     * The "Unreleased" section and releases without any entries are skipped.
     *
     * @return list<array{version: string, date: string|null, sections: list<array{type: string, items: list<string>}>}>
     */
    public function handle(?string $path = null, int $limit = 5): array
    {
        $path ??= base_path('CHANGELOG.md');

        if (! File::exists($path)) {
            return [];
        }

        $releases = [];
        $currentRelease = null;
        $currentSection = null;

        foreach (preg_split('/\R/', File::get($path)) as $line) {
            if (preg_match('/^##\s+\[?([^\]\s]+)\]?(?:\s+-\s+(\S+))?/', $line, $matches)) {
                if ($currentRelease !== null) {
                    $releases[] = $currentRelease;
                }

                $currentRelease = Str::lower($matches[1]) === 'unreleased'
                    ? null
                    : ['version' => $matches[1], 'date' => $matches[2] ?? null, 'sections' => []];
                $currentSection = null;

                continue;
            }

            if ($currentRelease === null) {
                continue;
            }

            if (preg_match('/^###\s+(.+)$/', $line, $matches)) {
                $currentRelease['sections'][] = ['type' => trim($matches[1]), 'items' => []];
                $currentSection = array_key_last($currentRelease['sections']);

                continue;
            }

            if ($currentSection !== null && preg_match('/^[-*]\s+(.+)$/', $line, $matches)) {
                $currentRelease['sections'][$currentSection]['items'][] = $this->toPlainText($matches[1]);
            }
        }

        if ($currentRelease !== null) {
            $releases[] = $currentRelease;
        }

        return collect($releases)
            ->map(function (array $release): array {
                $release['sections'] = array_values(array_filter(
                    $release['sections'],
                    fn (array $section): bool => $section['items'] !== [],
                ));

                return $release;
            })
            ->filter(fn (array $release): bool => $release['sections'] !== [])
            ->take($limit)
            ->values()
            ->all();
    }

    /**
     * Strip basic inline markdown (links, emphasis and code) from a changelog entry.
     */
    private function toPlainText(string $text): string
    {
        $text = preg_replace('/\[([^\]]+)\]\([^)]*\)/', '$1', $text);

        return trim(str_replace(['**', '__', '`'], '', $text));
    }
}
