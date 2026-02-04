import { AdminNav } from "@/components/admin-nav";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
            <AdminNav />
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex h-14 lg:h-[60px] items-center justify-between gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 md:hidden">
                    {/* Mobile Nav would go here, skipping for now to focus on core features */}
                    <span className="font-bold">Retail Admin</span>
                    <LanguageSwitcher />
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
