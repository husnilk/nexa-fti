import { usePage } from '@inertiajs/react';
import { Check, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { update as updateLocale } from '@/routes/locale';

/**
 * Switching language is a full page load (a plain link, not an Inertia visit)
 * so every module-level label is rebuilt in the new language.
 */
export function LanguageTabs({ className = '' }: { className?: string }) {
    const { locale, locales } = usePage().props;

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
        >
            {Object.entries(locales).map(([code, name]) => (
                <a
                    key={code}
                    href={updateLocale.url(code)}
                    aria-current={locale === code ? 'true' : undefined}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 text-sm transition-colors',
                        locale === code
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    {name}
                </a>
            ))}
        </div>
    );
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
    const { locale, locales } = usePage().props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn('gap-1.5', className)}
                    aria-label={__('Language')}
                >
                    <Languages className="h-4 w-4" />
                    <span className="uppercase">{locale}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.entries(locales).map(([code, name]) => (
                    <DropdownMenuItem key={code} asChild>
                        <a
                            href={updateLocale.url(code)}
                            className="flex w-full cursor-pointer items-center justify-between gap-4"
                        >
                            {name}
                            {locale === code && <Check className="h-4 w-4" />}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
