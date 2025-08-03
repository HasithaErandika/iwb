"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function SiteHeader() {
    const { data: session } = useSession();
    
    // Get user's display name or fallback to email
    const getUserDisplayName = () => {
        if (!session?.user) return "Guest";
        
        if (session.user.name) {
            return session.user.name;
        } else if (session.user.email) {
            return session.user.email.split('@')[0]; // Get username from email
        }
        
        return "User";
    };

    return (
        <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">Documents</h1>
                <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                        <span className="text-sm font-medium text-gray-700">
                            Hi, {getUserDisplayName()} 👋
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}
