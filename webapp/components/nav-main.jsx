"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({ items }) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = pathname === item.url || (item.url !== '/workspace' && pathname.startsWith(item.url + '/'));

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    className={cn(
                                        "min-h-10 px-3 py-3 text-lg",
                                        isActive && "bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white"
                                    )}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon className="!size-5" />}
                                        <span className="ml-2">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
