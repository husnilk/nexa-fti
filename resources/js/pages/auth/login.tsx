import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import ChangelogPanel from '@/components/changelog-panel';
import type { ChangelogRelease } from '@/components/changelog-panel';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import QuickLogin from '@/components/quick-login';
import type { QuickLoginUser } from '@/components/quick-login';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    changelog: ChangelogRelease[];
    quickLoginUsers?: QuickLoginUser[] | null;
};

export default function Login({
    status,
    canResetPassword,
    changelog,
    quickLoginUsers,
}: Props) {
    const { name } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center md:justify-start">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 font-medium"
                        >
                            <AppLogoIcon className="size-8 fill-current text-black dark:text-white" />
                            {name}
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex w-full max-w-sm flex-col gap-6">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    Log in to your account
                                </h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    Enter your email and password below to log
                                    in
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-6"
                            >
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-sm"
                                                    tabIndex={5}
                                                >
                                                    Forgot your password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    'remember',
                                                    checked as boolean,
                                                )
                                            }
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Log in
                                    </Button>
                                </div>
                            </form>

                            {quickLoginUsers && (
                                <QuickLogin users={quickLoginUsers} />
                            )}

                            {status && (
                                <div className="mb-4 text-center text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden bg-muted lg:sticky lg:top-0 lg:block lg:h-svh">
                    <ChangelogPanel releases={changelog} />
                </div>
            </div>
        </>
    );
}
