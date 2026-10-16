import id from '../../../lang/id.json';

export type Locale = 'id' | 'en';

/**
 * Indonesian strings keyed by their English source text (Laravel's JSON
 * translation format, shared with the backend's `__()`). English needs no
 * dictionary: a missing key falls back to the key itself.
 */
const dictionaries: Partial<Record<Locale, Record<string, string>>> = { id };

/**
 * The page language, rendered by the server into `<html lang>`. Switching
 * language reloads the page, so it never changes while a page is open and
 * module-level labels can be translated safely.
 */
export function currentLocale(): Locale {
    if (typeof document === 'undefined') {
        return 'id';
    }

    return document.documentElement.lang.startsWith('en') ? 'en' : 'id';
}

/**
 * BCP 47 tag for Intl / toLocale*String formatting in the current language.
 */
export function intlLocale(): string {
    return currentLocale() === 'en' ? 'en-GB' : 'id-ID';
}

/**
 * Translate an English source string, replacing `:placeholder` tokens.
 *
 *     __('Showing :from–:to of :total', { from: 1, to: 10, total: 42 })
 */
export function __(
    key: string,
    replace: Record<string, string | number | null | undefined> = {},
): string {
    let text = dictionaries[currentLocale()]?.[key] ?? key;

    // Longest names first so `:total` is not clobbered by a `:to` replacement.
    for (const name of Object.keys(replace).sort(
        (a, b) => b.length - a.length,
    )) {
        text = text.replaceAll(`:${name}`, String(replace[name] ?? ''));
    }

    return text;
}
