import { __ } from '@/lib/i18n';
import type { AttendanceCountField } from '@/types/remuneration';

export type AttendanceFieldDefinition = {
    name: AttendanceCountField;
    label: string;
    hint?: string;
};

export type AttendanceFieldGroup = {
    key: string;
    title: string;
    description: string;
    fields: AttendanceFieldDefinition[];
};

// TODO: replace the late / early-departure / maternity hints with the
// official duration brackets once they are confirmed.
export const attendanceFieldGroups: AttendanceFieldGroup[] = [
    {
        key: 'presence',
        title: __('Presence'),
        description: __(
            'Working days the employee was present, absent, or on assignment.',
        ),
        fields: [
            {
                name: 'present',
                label: __('Present'),
                hint: __('Attended work'),
            },
            { name: 'absent', label: __('Absent'), hint: __('Without notice') },
            {
                name: 'off_site_duty',
                label: __('Off-site Duty'),
                hint: __('Official duty outside the office'),
            },
            {
                name: 'study_assignment',
                label: __('Study Assignment'),
                hint: __('Study leave assignment'),
            },
        ],
    },
    {
        key: 'leave',
        title: __('Leave'),
        description: __('Days taken per leave type.'),
        fields: [
            {
                name: 'annual_leave',
                label: __('Annual Leave'),
                hint: __('Annual leave'),
            },
            {
                name: 'sick_leave',
                label: __('Sick Leave'),
                hint: __('Sick leave'),
            },
            {
                name: 'personal_leave',
                label: __('Personal Leave'),
                hint: __('Leave for important reasons'),
            },
            {
                name: 'long_service_leave',
                label: __('Long Service Leave'),
                hint: __('Long service leave'),
            },
            {
                name: 'maternity_leave',
                label: __('Maternity Leave'),
                hint: __('Maternity leave'),
            },
            {
                name: 'unpaid_leave',
                label: __('Unpaid Leave'),
                hint: __('Unpaid leave (CLTN)'),
            },
            {
                name: 'special_leave',
                label: __('Special Leave'),
                hint: __('Special leave'),
            },
        ],
    },
    {
        key: 'late',
        title: __('Late Arrival'),
        description: __('Number of late arrivals per duration level.'),
        fields: [1, 2, 3, 4, 5, 6].map((level) => ({
            name: `late_0${level}` as AttendanceCountField,
            label: `TL${level}`,
            hint: __('Late level :level', { level }),
        })),
    },
    {
        key: 'early_departure',
        title: __('Early Departure'),
        description: __('Number of early departures per duration level.'),
        fields: [1, 2, 3, 4, 5, 6].map((level) => ({
            name: `early_departure_0${level}` as AttendanceCountField,
            label: `PSW${level}`,
            hint: __('Early departure level :level', { level }),
        })),
    },
    {
        key: 'maternity_detail',
        title: __('Maternity Leave Detail'),
        description: __('Maternity leave breakdown.'),
        fields: [1, 2, 3].map((level) => ({
            name: `maternity_leave_0${level}` as AttendanceCountField,
            label: __('Maternity :level', { level }),
        })),
    },
];

export const attendanceCountFields: AttendanceCountField[] =
    attendanceFieldGroups.flatMap((group) =>
        group.fields.map((field) => field.name),
    );

export const monthNames = [
    __('January'),
    __('February'),
    __('March'),
    __('April'),
    __('May'),
    __('June'),
    __('July'),
    __('August'),
    __('September'),
    __('October'),
    __('November'),
    __('December'),
];

export function monthName(month: number): string {
    return monthNames[month - 1] ?? String(month);
}

export function sumFields(
    record: Partial<Record<AttendanceCountField, number | null>>,
    prefix: string,
): number {
    return attendanceCountFields
        .filter((field) => field.startsWith(prefix))
        .reduce((total, field) => total + (record[field] ?? 0), 0);
}
