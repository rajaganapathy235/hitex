"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    aria-label="Switch language"
                >
                    <Languages className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => switchLanguage("en")}
                    className={locale === "en" ? "bg-accent" : ""}
                >
                    <span className="mr-2">🇬🇧</span>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => switchLanguage("hi")}
                    className={locale === "hi" ? "bg-accent" : ""}
                >
                    <span className="mr-2">🇮🇳</span>
                    हिन्दी (Hindi)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
