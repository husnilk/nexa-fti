import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Award,
    BadgeCheck,
    BookOpen,
    Briefcase,
    Building2,
    Calendar,
    CalendarRange,
    ClipboardCheck,
    ClipboardList,
    Clock,
    FileText,
    GraduationCap,
    HeartHandshake,
    LayoutGrid,
    Library,
    ListChecks,
    MapPin,
    Microscope,
    Monitor,
    Share2,
    ShieldCheck,
    ShoppingCart,
    Tags,
    Target,
    Users,
    Wrench,
} from 'lucide-react';
import { Fragment } from 'react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { __ } from '@/lib/i18n';
import { dashboard } from '@/routes';
import { index as activitiesIndex } from '@/routes/activities';
import { index as assignmentsIndex } from '@/routes/assignments';
import { index as monthlyAttendanceIndex } from '@/routes/attendances';
import { index as booksIndex } from '@/routes/books';
import { index as certificationsIndex } from '@/routes/certifications';
import { index as committeesIndex } from '@/routes/committees';
import { index as communityServiceIndex } from '@/routes/community-services';
import { index as documentsIndex } from '@/routes/documents';
import { index as attendanceIndex } from '@/routes/employee-attendances';
import { index as employeesIndex } from '@/routes/employees';
import { index as eptIndex } from '@/routes/epts';
import { index as equipmentIndex } from '@/routes/equipment';
import { index as equipmentDistributionsIndex } from '@/routes/equipment-distributions';
import { index as equipmentMaintenanceRequestsIndex } from '@/routes/equipment-maintenance-requests';
import { index as equipmentModelsIndex } from '@/routes/equipment-models';
import { index as equipmentProcurementsIndex } from '@/routes/equipment-procurements';
import { index as equipmentUsagesIndex } from '@/routes/equipment-usages';
import { index as eventsIndex } from '@/routes/events';
import { stock as inventoryStockIndex } from '@/routes/inventory';
import { index as itemIndex } from '@/routes/inventory-items';
import { index as procurementIndex } from '@/routes/inventory-procurements';
import { index as requestIndex } from '@/routes/inventory-requests';
import { index as leaveApprovalsIndex } from '@/routes/leave-approvals';
import { index as leaveRequestsIndex } from '@/routes/leave-requests';
import { index as meetingsIndex } from '@/routes/meetings';
import { index as organizationsIndex } from '@/routes/organizations';
import { index as overtimeApprovalsIndex } from '@/routes/overtime-approvals';
import { index as overtimeRequestsIndex } from '@/routes/overtime-requests';
import { index as verificationsIndex } from '@/routes/performance-verifications';
import { index as periodsIndex } from '@/routes/periods';
import { index as personalLeaveRequestsIndex } from '@/routes/personal-leave-requests';
import { index as personalOvertimeRequestsIndex } from '@/routes/personal-overtime-requests';
import { index as positionsIndex } from '@/routes/positions';
import { index as publicationIndex } from '@/routes/publications';
import { index as researchIndex } from '@/routes/research';
import { index as maintenanceRequestsIndex } from '@/routes/room-maintenance-requests';
import { index as roomUsagesIndex } from '@/routes/room-usages';
import { index as roomsIndex } from '@/routes/rooms';
import { index as rubricsIndex } from '@/routes/rubrics';
import { index as studentsIndex } from '@/routes/students';
import { index as trainingsIndex } from '@/routes/trainings';
import { index as usersIndex } from '@/routes/users';
import { index as validatorsIndex } from '@/routes/validators';
import type { Auth, NavItem } from '@/types';

type PageProps = {
    auth: Auth;
};

/**
 * A menu entry with the permissions its route accepts (any one is enough).
 * Keep these in sync with the `permission:` middleware or controller check
 * of the linked page. Omit `permissions` for pages every signed-in user can open.
 */
type PermissionNavItem = NavItem & {
    permissions?: string[];
    /** Extra rule for items gated by data rather than a permission. */
    visible?: (auth: Auth) => boolean;
};

type NavGroup = {
    label?: string;
    items: PermissionNavItem[];
};

const footerNavItems: NavItem[] = [];

const navGroups: NavGroup[] = [
    {
        items: [
            {
                title: __('Dashboard'),
                href: dashboard(),
                icon: LayoutGrid,
                permissions: ['dashboard.view'],
            },
        ],
    },
    {
        label: __('HR & Operations'),
        items: [
            {
                title: __('Employees'),
                href: employeesIndex(),
                icon: Users,
                permissions: ['hr.view'],
            },
            {
                title: __('Attendance'),
                href: attendanceIndex(),
                icon: ClipboardCheck,
                permissions: ['hr.view'],
            },
            {
                title: __('Leave Requests'),
                href: leaveRequestsIndex(),
                icon: FileText,
                permissions: ['leave.view'],
            },
            {
                title: __('Overtime Requests'),
                href: overtimeRequestsIndex(),
                icon: Clock,
                permissions: ['overtime.view'],
            },
            {
                title: __('Assignments'),
                href: assignmentsIndex(),
                icon: ListChecks,
                permissions: ['assignment.view', 'assignment.manage'],
            },
            {
                title: __('Trainings'),
                href: trainingsIndex(),
                icon: GraduationCap,
                permissions: ['training.view'],
            },
            {
                title: __('Certifications'),
                href: certificationsIndex(),
                icon: Award,
                permissions: ['certification.manage'],
            },
        ],
    },
    {
        label: __('Remuneration'),
        items: [
            {
                title: __('Periods'),
                href: periodsIndex(),
                icon: CalendarRange,
                permissions: ['period.manage'],
            },
            {
                title: __('Rubrics'),
                href: rubricsIndex(),
                icon: ClipboardList,
                permissions: ['rubric.view', 'rubric.manage'],
            },
            {
                title: __('Monthly Attendance'),
                href: monthlyAttendanceIndex(),
                icon: ClipboardCheck,
                permissions: ['attendance.view', 'attendance.manage'],
            },
            {
                title: __('Performance Targets'),
                href: eptIndex(),
                icon: Target,
                permissions: ['ept.view', 'ept.manage'],
            },
            {
                title: __('Activities'),
                href: activitiesIndex(),
                icon: Activity,
                permissions: ['activity.view', 'activity.manage'],
            },
            {
                title: __('Validators'),
                href: validatorsIndex(),
                icon: ShieldCheck,
                permissions: ['validator.manage'],
            },
            {
                title: __('Verification'),
                href: verificationsIndex(),
                icon: BadgeCheck,
                visible: (auth) => auth.is_verifier === true,
            },
        ],
    },
    {
        label: __('Students'),
        items: [
            {
                title: __('Students'),
                href: studentsIndex(),
                icon: GraduationCap,
                permissions: ['students.view'],
            },
        ],
    },
    {
        label: __('Academic'),
        items: [
            {
                title: __('Research'),
                href: researchIndex(),
                icon: Microscope,
                permissions: ['research.view'],
            },
            {
                title: __('Community Service'),
                href: communityServiceIndex(),
                icon: HeartHandshake,
                permissions: ['community_service.view'],
            },
            {
                title: __('Publications'),
                href: publicationIndex(),
                icon: BookOpen,
                permissions: ['publication.view'],
            },
            {
                title: __('Authored Books'),
                href: booksIndex(),
                icon: Library,
                permissions: ['book.view'],
            },
        ],
    },
    {
        label: __('Documents'),
        items: [
            {
                title: __('Documents'),
                href: documentsIndex(),
                icon: FileText,
                permissions: ['document.view', 'document.manage'],
            },
        ],
    },
    {
        label: __('Activities'),
        items: [
            {
                title: __('Committees'),
                href: committeesIndex(),
                icon: ShieldCheck,
                permissions: ['committee.view'],
            },
            {
                title: __('Meetings'),
                href: meetingsIndex(),
                icon: Calendar,
                permissions: ['meeting.view', 'meeting.manage'],
            },
            {
                title: __('Events'),
                href: eventsIndex(),
                icon: Award,
                permissions: ['event.view', 'event.manage'],
            },
        ],
    },
    {
        label: __('Inventory'),
        items: [
            {
                title: __('Stock Overview'),
                href: inventoryStockIndex(),
                icon: ClipboardCheck,
                permissions: ['inventory.manage'],
            },
            {
                title: __('Items'),
                href: itemIndex(),
                icon: Library,
                permissions: ['inventory.manage'],
            },
            {
                title: __('Procurements'),
                href: procurementIndex(),
                icon: FileText,
                permissions: ['inventory.procurement'],
            },
            {
                title: __('Requests'),
                href: requestIndex(),
                icon: FileText,
                permissions: ['inventory.request'],
            },
        ],
    },
    {
        label: __('Equipment'),
        items: [
            {
                title: __('Equipment List'),
                href: equipmentIndex(),
                icon: Monitor,
                permissions: ['equipment.view'],
            },
            {
                title: __('Distributions'),
                href: equipmentDistributionsIndex(),
                icon: Share2,
                permissions: ['equipment.manage'],
            },
            {
                title: __('Models'),
                href: equipmentModelsIndex(),
                icon: Tags,
                permissions: ['equipment.view'],
            },
            {
                // The route group is nested inside the `equipment.manage` group, so manage is required in practice.
                title: __('Maintenance Requests'),
                href: equipmentMaintenanceRequestsIndex(),
                icon: Wrench,
                permissions: ['equipment.manage'],
            },
            {
                title: __('Procurements'),
                href: equipmentProcurementsIndex(),
                icon: ShoppingCart,
                permissions: ['equipment.view'],
            },
            {
                title: __('Loans'),
                href: equipmentUsagesIndex(),
                icon: HeartHandshake,
                permissions: ['equipment.borrow', 'equipment.manage'],
            },
        ],
    },
    {
        label: __('Self-Service'),
        items: [
            {
                title: __('My Leave Requests'),
                href: personalLeaveRequestsIndex(),
                icon: FileText,
                permissions: ['personal.manage'],
            },
            {
                title: __('My Overtime Requests'),
                href: personalOvertimeRequestsIndex(),
                icon: Clock,
                permissions: ['personal.manage'],
            },
            {
                title: __('Leave Approvals'),
                href: leaveApprovalsIndex(),
                icon: ClipboardCheck,
                permissions: ['leave.approval'],
            },
            {
                title: __('Overtime Approvals'),
                href: overtimeApprovalsIndex(),
                icon: ClipboardCheck,
                permissions: ['overtime.approval'],
            },
        ],
    },
    {
        label: __('Assets & Facilities'),
        items: [
            {
                title: __('Rooms'),
                href: roomsIndex(),
                icon: MapPin,
                permissions: ['room.view'],
            },
            {
                title: __('Room Usages'),
                href: roomUsagesIndex(),
                icon: Calendar,
                permissions: ['room.request', 'room.view', 'room.manage'],
            },
            // Open to everyone: users see and report their own maintenance requests.
            {
                title: __('Maintenance'),
                href: maintenanceRequestsIndex(),
                icon: Wrench,
            },
        ],
    },
    {
        label: __('Administration'),
        items: [
            {
                title: __('Organizations'),
                href: organizationsIndex(),
                icon: Building2,
                permissions: ['organization.view'],
            },
            {
                title: __('Positions'),
                href: positionsIndex(),
                icon: Briefcase,
                permissions: ['organizations.view'],
            },
        ],
    },
    {
        label: __('System Settings'),
        items: [
            {
                title: __('Users'),
                href: usersIndex(),
                icon: Users,
                permissions: ['account.view'],
            },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    const isSuperAdmin = auth.roles.includes('super-admin');
    const canSee = (item: PermissionNavItem): boolean =>
        isSuperAdmin ||
        (item.visible
            ? item.visible(auth)
            : !item.permissions ||
              item.permissions.some((permission) =>
                  auth.permissions.includes(permission),
              ));

    const visibleGroups = navGroups
        .map((group) => ({ ...group, items: group.items.filter(canSee) }))
        .filter((group) => group.items.length > 0);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                {visibleGroups.map((group, index) => (
                    <Fragment key={group.label ?? 'main'}>
                        {index > 0 && <SidebarSeparator />}
                        <NavMain label={group.label} items={group.items} />
                    </Fragment>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
