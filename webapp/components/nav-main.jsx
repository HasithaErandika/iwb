"use client";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">                <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>                            <SidebarMenuButton tooltip={item.title} className="min-h-10 px-3 py-3 text-lg">
                        {item.icon && <item.icon className="!size-5" />}
                        <span className="ml-2">{item.title}</span>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
