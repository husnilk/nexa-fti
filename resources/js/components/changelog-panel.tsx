import { Badge } from '@/components/ui/badge';

export type ChangelogSection = {
    type: string;
    items: string[];
};

export type ChangelogRelease = {
    version: string;
    date: string | null;
    sections: ChangelogSection[];
};

const sectionBadgeVariants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Added: 'default',
    Changed: 'secondary',
    Fixed: 'outline',
    Removed: 'destructive',
    Security: 'destructive',
};

function formatDate(date: string | null): string | null {
    if (!date) {
        return null;
    }

    const parsed = new Date(`${date}T00:00:00`);

    return Number.isNaN(parsed.getTime())
        ? date
        : parsed.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          });
}

export default function ChangelogPanel({
    releases,
}: {
    releases: ChangelogRelease[];
}) {
    return (
        <div className="flex h-full flex-col gap-6 p-6 md:p-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">What's new</h2>
                <p className="text-sm text-muted-foreground">
                    Recent updates and improvements to the system.
                </p>
            </div>

            {releases.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No updates have been published yet.
                </p>
            ) : (
                <ol className="min-h-0 flex-1 space-y-8 overflow-y-auto border-l pl-6">
                    {releases.map((release) => (
                        <li key={release.version} className="relative">
                            <span className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-primary ring-4 ring-muted" />
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <h3 className="font-semibold">
                                    v{release.version}
                                </h3>
                                {release.date && (
                                    <time
                                        dateTime={release.date}
                                        className="text-xs text-muted-foreground"
                                    >
                                        {formatDate(release.date)}
                                    </time>
                                )}
                            </div>

                            <div className="mt-3 space-y-3">
                                {release.sections.map((section) => (
                                    <div
                                        key={section.type}
                                        className="space-y-1.5"
                                    >
                                        <Badge
                                            variant={
                                                sectionBadgeVariants[
                                                    section.type
                                                ] ?? 'outline'
                                            }
                                        >
                                            {section.type}
                                        </Badge>
                                        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                            {section.items.map(
                                                (item, index) => (
                                                    <li key={index}>{item}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
