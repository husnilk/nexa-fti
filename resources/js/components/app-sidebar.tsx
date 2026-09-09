import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Briefcase,
    Building2,
    Calendar,
    ClipboardCheck,
    Clock,
    FileText,
    LayoutGrid,
    Library,
    ShieldCheck,
    Users,
    GraduationCap,
    Microscope,
    HeartHandshake,
    MapPin,
    Wrench,
    Monitor,
    Tags,
    ShoppingCart,
    Share2,
    ListChecks,
} from 'lucide-react';
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
import { dashboard } from '@/routes';
import { index as assignmentsIndex } from '@/routes/assignments';

import { index as certificationsIndex } from '@/routes/certifications';
import { index as committeesIndex } from '@/routes/committees';
import { index as communityServiceIndex } from '@/routes/community-services';

import { index as documentsIndex } from '@/routes/documents';
import { index as attendanceIndex } from '@/routes/employee-attendances';
import { index as employeesIndex } from '@/routes/employees';
import {
    index as equipmentIndex,
} from '@/routes/equipment';

import {
    index as equipmentDistributionsIndex,
} from '@/routes/equipment-distributions';
import {
    index as equipmentMaintenanceRequestsIndex,
} from '@/routes/equipment-maintenance-requests';
import {
    index as equipmentModelsIndex,
} from '@/routes/equipment-models';
import {
    index as equipmentProcurementsIndex,
} from '@/routes/equipment-procurements';

import {
    index as equipmentUsagesIndex,
} from '@/routes/equipment-usages';
import { index as eventsIndex } from '@/routes/events';
import { stock as inventoryStockIndex } from '@/routes/inventory';


import {
    index as itemIndex,
} from '@/routes/inventory-items';
import {
    index as procurementIndex,
} from '@/routes/inventory-procurements';

import {
    index as requestIndex,
} from '@/routes/inventory-requests';

import { index as leaveApprovalsIndex } from '@/routes/leave-approvals';
import { index as leaveRequestsIndex } from '@/routes/leave-requests';
import { index as meetingsIndex } from '@/routes/meetings';
import { index as organizationsIndex } from '@/routes/organizations';
import { index as overtimeApprovalsIndex } from '@/routes/overtime-approvals';
import { index as overtimeRequestsIndex } from '@/routes/overtime-requests';
import { index as personalLeaveRequestsIndex } from '@/routes/personal-leave-requests';
import { index as personalOvertimeRequestsIndex } from '@/routes/personal-overtime-requests';
import { index as positionsIndex } from '@/routes/positions';
import { index as publicationIndex } from '@/routes/publications';
import { index as researchIndex } from '@/routes/research';
import { index as maintenanceRequestsIndex } from '@/routes/room-maintenance-requests';
import { index as roomUsagesIndex } from '@/routes/room-usages';
import { index as roomsIndex } from '@/routes/rooms';
import { index as studentsIndex } from '@/routes/students';
import { index as trainingsIndex } from '@/routes/trainings';
import { index as usersIndex } from '@/routes/users';
import type { Auth, NavItem } from '@/types';

type PageProps = {
    auth: Auth;
};

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    const hasRole = (name: string) => auth.roles.includes(name);
    const hasPermission = (module: string) =>
        hasRole('super-admin') ||
        auth.permissions.some((p) => p === module || p.startsWith(`${module}.`));

    const canViewAccount = hasPermission('account');
    const canViewOrganizations = hasPermission('organizations') || hasPermission('organization');

    const canViewHr = hasPermission('hr');
    const canViewStudents = hasPermission('students');
    const canViewResearch = hasPermission('research');
    const canViewCommunityService = hasPermission('community_service');
    const canViewPublication = hasPermission('publication');
    const canViewBook = hasPermission('book');
    const canViewInventory = hasPermission('inventory');
    const canViewEquipment = hasPermission('equipment');
    const canViewAssets = hasPermission('building') || hasPermission('room');
    const canViewDocuments = hasPermission('document');
    const canViewCommittee = hasPermission('committee');
    const canViewMeetings = hasPermission('meeting');
    const canViewEvents = hasPermission('event');
    const canViewAssignments = hasPermission('assignment');
    const canViewTraining = hasPermission('training');
    const canViewCertification = hasPermission('certification');
    const canViewPersonal = hasPermission('personal');

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    const inventoryNavItems: NavItem[] = [];

    if (canViewInventory) {
        if (auth.permissions.includes('inventory.manage') || hasRole('super-admin')) {
            inventoryNavItems.push({
                title: 'Stock Overview',
                href: inventoryStockIndex(),
                icon: ClipboardCheck,
            });
            inventoryNavItems.push({
                title: 'Items',
                href: itemIndex(),
                icon: Library,
            });
        }

        if (auth.permissions.includes('inventory.procurement') || hasRole('super-admin')) {
            inventoryNavItems.push({
                title: 'Procurements',
                href: procurementIndex(),
                icon: FileText,
            });
        }

        if (auth.permissions.includes('inventory.request') || hasRole('super-admin')) {
            inventoryNavItems.push({
                title: 'Requests',
                href: requestIndex(),
                icon: FileText,
            });
        }
    }

    const equipmentNavItems: NavItem[] = [];

    if (canViewEquipment) {
        if (hasPermission('equipment.view') || hasPermission('equipment.manage')) {
            equipmentNavItems.push({
                title: 'Equipment List',
                href: equipmentIndex(),
                icon: Monitor,
            });
        }
        if (hasPermission('equipment.manage')) {
            equipmentNavItems.push({
                title: 'Distributions',
                href: equipmentDistributionsIndex(),
                icon: Share2,
            });
        }
        if (hasPermission('equipment.view') || hasPermission('equipment.manage')) {
            equipmentNavItems.push({
                title: 'Models',
                href: equipmentModelsIndex(),
                icon: Tags,
            });
            equipmentNavItems.push({
                title: 'Maintenance Requests',
                href: equipmentMaintenanceRequestsIndex(),
                icon: Wrench,
            });
            equipmentNavItems.push({
                title: 'Procurements',
                href: equipmentProcurementsIndex(),
                icon: ShoppingCart,
            });
        }
        if (hasPermission('equipment.borrow') || hasPermission('equipment.manage')) {
            equipmentNavItems.push({
                title: 'Loans',
                href: equipmentUsagesIndex(),
                icon: HeartHandshake,
            });
        }
    }

    const academicNavItems: NavItem[] = [];

    if (canViewResearch) {
        academicNavItems.push({
            title: 'Research',
            href: researchIndex(),
            icon: Microscope,
        });
    }

    if (canViewCommunityService) {
        academicNavItems.push({
            title: 'Community Service',
            href: communityServiceIndex(),
            icon: HeartHandshake,
        });
    }

    if (canViewPublication) {
        academicNavItems.push({
            title: 'Publications',
            href: publicationIndex(),
            icon: BookOpen,
        });
    }

    if (canViewBook) {
        academicNavItems.push({
            title: 'Authored Books',
            href: '/books',
            icon: Library,
        });
    }

    const hrNavItems: NavItem[] = [];

    if (canViewHr || canViewTraining) {
        if (canViewHr) {
            hrNavItems.push({
                title: 'Employees',
                href: employeesIndex(),
                icon: Users,
            });
            hrNavItems.push({
                title: 'Attendance',
                href: attendanceIndex(),
                icon: ClipboardCheck,
            });
            hrNavItems.push({
                title: 'Leave Requests',
                href: leaveRequestsIndex(),
                icon: FileText,
            });
            hrNavItems.push({
                title: 'Overtime Requests',
                href: overtimeRequestsIndex(),
                icon: Clock,
            });
        }

        if (canViewAssignments) {
            hrNavItems.push({
                title: 'Assignments',
                href: assignmentsIndex(),
                icon: ListChecks,
            });
        }

        if (canViewTraining) {
            hrNavItems.push({
                title: 'Trainings',
                href: trainingsIndex(),
                icon: GraduationCap,
            });
        }

        if (canViewCertification) {
            hrNavItems.push({
                title: 'Certifications',
                href: certificationsIndex(),
                icon: Award,
            });
        }
    }

    const studentNavItems: NavItem[] = [];

    if (canViewStudents) {
        studentNavItems.push({
            title: 'Students',
            href: studentsIndex(),
            icon: GraduationCap,
        });
    }

    const adminNavItems: NavItem[] = [];

    if (canViewOrganizations) {
        adminNavItems.push({
            title: 'Organizations',
            href: organizationsIndex(),
            icon: Building2,
        });

        adminNavItems.push({
            title: 'Positions',
            href: positionsIndex(),
            icon: Briefcase,
        });
    }

    const systemNavItems: NavItem[] = [];

    if (canViewAccount) {
        systemNavItems.push({
            title: 'Users',
            href: usersIndex(),
            icon: Users,
        });
    }


    const assetNavItems: NavItem[] = [];

    if (canViewAssets) {
        assetNavItems.push({
            title: 'Rooms',
            href: roomsIndex(),
            icon: MapPin,
        });
    }

    if (hasPermission('room.request') || hasPermission('room.view') || hasPermission('room.manage')) {
        assetNavItems.push({
            title: 'Room Usages',
            href: roomUsagesIndex(),
            icon: Calendar,
        });
    }

    assetNavItems.push({
        title: 'Maintenance',
        href: maintenanceRequestsIndex(),
        icon: Wrench,
    });

    const documentNavItems: NavItem[] = [];

    if (canViewDocuments) {
        documentNavItems.push({
            title: 'Documents',
            href: documentsIndex(),
            icon: FileText,
        });
        // Document Types moved to Documents index page
    }

    const activityNavItems: NavItem[] = [];

    if (canViewCommittee) {
        activityNavItems.push({
            title: 'Committees',
            href: committeesIndex(),
            icon: ShieldCheck,
        });
    }

    if (canViewMeetings) {
        activityNavItems.push({
            title: 'Meetings',
            href: meetingsIndex(),
            icon: Calendar,
        });
    }

    if (canViewEvents) {
        activityNavItems.push({
            title: 'Events',
            href: eventsIndex(),
            icon: Award,
        });
    }


    const personalNavItems: NavItem[] = [];

    if (canViewPersonal) {
        personalNavItems.push({
            title: 'My Leave Requests',
            href: personalLeaveRequestsIndex(),
            icon: FileText,
        });
        personalNavItems.push({
            title: 'My Overtime Requests',
            href: personalOvertimeRequestsIndex(),
            icon: Clock,
        });
    }

    if (auth.permissions.includes('leave.approval') || hasRole('super-admin')) {
        personalNavItems.push({
            title: 'Leave Approvals',
            href: leaveApprovalsIndex(),
            icon: ClipboardCheck,
        });
    }

    if (auth.permissions.includes('overtime.approval') || hasRole('super-admin')) {
        personalNavItems.push({
            title: 'Overtime Approvals',
            href: overtimeApprovalsIndex(),
            icon: ClipboardCheck,
        });
    }

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
                <NavMain items={mainNavItems} />

                {hrNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="HR & Operations" items={hrNavItems} />
                    </>
                )}

                {studentNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Students" items={studentNavItems} />
                    </>
                )}

                {academicNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Academic" items={academicNavItems} />
                    </>
                )}

                {documentNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Documents" items={documentNavItems} />
                    </>
                )}

                {activityNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Activities" items={activityNavItems} />
                    </>
                )}

                {inventoryNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Inventory" items={inventoryNavItems} />
                    </>
                )}

                {equipmentNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Equipment" items={equipmentNavItems} />
                    </>
                )}

                {personalNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain
                            label="Self-Service"
                            items={personalNavItems}
                        />
                    </>
                )}

                {assetNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain
                            label="Assets & Facilities"
                            items={assetNavItems}
                        />
                    </>
                )}

                {adminNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Administration" items={adminNavItems} />
                    </>
                )}

                {systemNavItems.length > 0 && (
                    <>
                        <SidebarSeparator />
                        <NavMain
                            label="System Settings"
                            items={systemNavItems}
                        />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
