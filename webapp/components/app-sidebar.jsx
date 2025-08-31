"use client"

import * as React from "react"
import {
    IconBriefcase,
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconDeviceIpadPin,
    IconMapPinShare,
    IconMessageCircleSearch,
    IconReport,
    IconSearch,
    IconSettings,
    IconSteam,
    IconUsers,
    IconUsersPlus,
    IconSmartHome,
    IconBuildingBank,
    IconMapSearch,
    IconLocationPin,
    IconNavigationShare,
    IconSquareRoundedPercentage
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { CalendarDays } from "lucide-react"

const data = {
    user: {
        name: "Chamal Senarathna",
        email: "chamals004@gmail.com",
        avatar: "/avatars/shadcn.jpg"
    },
    navMain: [
        {
            title: "Home",
            url: "/workspace",
            icon: IconSmartHome
        },
        {
            title: "City Rank",
            url: "/workspace/city-rank",
            icon: IconNavigationShare
        },
        {
            title: "Incident Map",
            url: "/workspace/map",
            icon: IconMapSearch
        },
        {
            title: "Meetups",
            url: "/workspace/meetups",
            icon: IconDeviceIpadPin
        },
        {
            title: "Remote Jobs",
            url: "/workspace/jobs",
            icon: IconBriefcase
        },
        {
            title: "Places",
            url: "/workspace/places",
            icon: IconBuildingBank
        }
    ],
}

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-2  mb-3">
                            <a href="#">
                                <span className="text-xl font-semibold">The Cinnamon Circle</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
