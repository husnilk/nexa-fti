import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import LeaveRequestController from '@/actions/App/Http/Controllers/Hr/LeaveRequestController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, Employee, LeaveType } from '@/types';

interface PageProps {
    auth: Auth;
    leaveTypes: LeaveType[];
    employees: Employee[];
}

export default function LeaveRequestCreate({
    leaveTypes,
    employees,
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        total_days: 1,
        reason: '',
        address_leave: '',
        contact_leave: '',
        approver_level_1_id: '',
        approver_level_2_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(LeaveRequestController.store.url());
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="New Leave Request" />

            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={LeaveRequestController.index.url()}>
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        New Leave Request
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Submit a new leave request for approval workflow.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Request Information</h3>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="employee_id">Employee</Label>
                            <Select
                                value={data.employee_id}
                                onValueChange={(val) => setData('employee_id', val)}
                            >
                                <SelectTrigger id="employee_id">
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.employee_id && (
                                <p className="text-sm text-destructive">
                                    {errors.employee_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="leave_type_id">Leave Type</Label>
                            <Select
                                value={data.leave_type_id}
                                onValueChange={(val) =>
                                    setData('leave_type_id', val)
                                }
                            >
                                <SelectTrigger id="leave_type_id">
                                    <SelectValue placeholder="Select leave type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {leaveTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id.toString()}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.leave_type_id && (
                                <p className="text-sm text-destructive">
                                    {errors.leave_type_id}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                    required
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                    required
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_days">Total Days</Label>
                            <Input
                                id="total_days"
                                type="number"
                                min="1"
                                value={data.total_days}
                                onChange={(e) =>
                                    setData('total_days', parseInt(e.target.value) || 0)
                                }
                                required
                            />
                            {errors.total_days && (
                                <p className="text-sm text-destructive">
                                    {errors.total_days}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="State the reason for your leave request..."
                                required
                                className="min-h-[100px]"
                            />
                            {errors.reason && (
                                <p className="text-sm text-destructive">
                                    {errors.reason}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 grid gap-6">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-2">Approvers</h3>
                        
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="approver_level_1_id">
                                    Level 1 Approver
                                </Label>
                                <Select
                                    value={data.approver_level_1_id}
                                    onValueChange={(val) =>
                                        setData('approver_level_1_id', val)
                                    }
                                >
                                    <SelectTrigger id="approver_level_1_id">
                                        <SelectValue placeholder="Select level 1 approver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.approver_level_1_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.approver_level_1_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="approver_level_2_id">
                                    Level 2 Approver
                                </Label>
                                <Select
                                    value={data.approver_level_2_id}
                                    onValueChange={(val) =>
                                        setData('approver_level_2_id', val)
                                    }
                                >
                                    <SelectTrigger id="approver_level_2_id">
                                        <SelectValue placeholder="Select level 2 approver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.approver_level_2_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.approver_level_2_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 grid gap-6">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-2">Contact Info (During Leave)</h3>
                        
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="address_leave">Address</Label>
                                <Input
                                    id="address_leave"
                                    value={data.address_leave}
                                    onChange={(e) => setData('address_leave', e.target.value)}
                                    placeholder="Temporary address during leave"
                                />
                                {errors.address_leave && (
                                    <p className="text-sm text-destructive">
                                        {errors.address_leave}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact_leave">Contact Number</Label>
                                <Input
                                    id="contact_leave"
                                    value={data.contact_leave}
                                    onChange={(e) => setData('contact_leave', e.target.value)}
                                    placeholder="Phone number"
                                />
                                {errors.contact_leave && (
                                    <p className="text-sm text-destructive">
                                        {errors.contact_leave}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <Link href={LeaveRequestController.index.url()}>
                        <Button type="button" variant="outline" className="cursor-pointer">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing} className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md gap-2">
                        <Save className="h-4 w-4" /> Submit Request
                    </Button>
                </div>
            </form>
        </div>
    );
}

LeaveRequestCreate.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Leave Requests', href: LeaveRequestController.index.url() },
        { title: 'New Request', href: '#' },
    ],
};
