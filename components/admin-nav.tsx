"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    CreditCard,
    Users
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export function AdminNav() {
    const t = useTranslations("Common");
    const adminT = useTranslations("Admin");
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/admin/agents", label: "Agents", icon: Users },
        { href: "/admin/ledger", label: adminT("ledger"), icon: FileText },
        { href: "/admin/invoices", label: adminT("addInvoice"), icon: FileText },
        { href: "/admin/withdrawals", label: adminT("pending"), icon: CreditCard },
        { href: "/admin/settings", label: t("settings"), icon: Settings },
    ];

    return (
        <div className="flex h-screen flex-col border-r bg-gray-100/40 dark:bg-gray-800/40 w-64 hidden md:flex">
            <div className="flex h-14 items-center justify-between border-b px-6">
                <span className="font-bold text-lg">Retail Admin</span>
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
