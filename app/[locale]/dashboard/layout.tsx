"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    History,
    Wallet,
    LogOut
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export function AgentNav() {
    const t = useTranslations("Common");
    const agentT = useTranslations("Agent");
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/dashboard/history", label: agentT("transactions"), icon: History },
        { href: "/dashboard/redeem", label: agentT("redeem"), icon: Wallet },
    ];

    return (
        <div className="flex h-screen flex-col border-r bg-gray-50/40 dark:bg-gray-900/40 w-64 hidden md:flex">
            <div className="flex h-14 items-center justify-between border-b px-6">
                <span className="font-bold text-lg">Agent Portal</span>
                <LanguageSwitcher />
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === link.href
                                    ? "bg-gray-100 text-primary dark:bg-gray-800"
                                    : "text-muted-foreground"
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                <Link
                    href="/auth"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary"
                >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                </Link>
            </div>
        </div>
    );
}

export default function AgentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
            <AgentNav />
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex h-14 items-center justify-between border-b px-6 md:hidden">
                    <span className="font-bold">Agent Portal</span>
                    <LanguageSwitcher />
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
