"use client";

import React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SiteHeader() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const getUserDisplayName = () => {
        if (!session?.user) return "Guest";

        if (session.user.given_name) {
            return session.user.given_name;
        } else if (session.user.email) {
            return session.user.email.split('@')[0];
        }
        return "User";
    };

    const toTitleCase = (value) =>
        decodeURIComponent(value)
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    const mapSegmentLabel = (segment) => {
        switch (segment) {
            case "workspace":
                return "Workspace";
            case "city-rank":
                return "City Rank";
            case "add-city":
                return "Add City";
            case "city-guide":
                return "City Guide";
            case "jobs":
                return "Jobs";
            case "meetups":
                return "Meetups";
            case "places":
                return "Places";
            default:
                return toTitleCase(segment);
        }
    };

    const segments = pathname?.split("/").filter(Boolean) ?? [];
    const workspaceIndex = segments.indexOf("workspace");
    const crumbSegments = workspaceIndex >= 0 ? segments.slice(0) : segments;
    let assembled = [];
    if (crumbSegments.length > 0) {
        let pathParts = [];
        crumbSegments.forEach((seg, idx) => {
            pathParts.push(seg);
            const href = "/" + pathParts.join("/");
            const label = mapSegmentLabel(seg);
            assembled.push({ href, label, isLast: idx === crumbSegments.length - 1 });
        });
    }

    return (
        <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) rounded-t-xl">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {assembled.map((crumb, index) => (
                            <React.Fragment key={crumb.href}>
                                <BreadcrumbItem>
                                    {crumb.isLast ? (
                                        <BreadcrumbPage className="text-foreground text-sm lg:text-base font-medium">
                                            {crumb.label}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild className="text-sm lg:text-base">
                                            <Link href={crumb.href}>{crumb.label}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < assembled.length - 1 && (
                                    <BreadcrumbSeparator />
                                )}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
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
