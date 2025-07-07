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
    IconMapPinShare,
    IconMessageCircleSearch,
    IconReport,
    IconSearch,
    IconSettings,
    IconSteam,
    IconUsers,
    IconUsersPlus
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
            icon: IconDashboard
        },
        {
            title: "Remote Jobs",
            url: "/workspace/jobs",
            icon: IconBriefcase
        },
        {
            title: "Places",
            url: "/workspace/places",
            icon: IconMapPinShare
        },
        {
            title: "Meetups",
            url: "#",
            icon: IconSteam
        },
        {
            title: "City Guide",
            url: "#",
            icon: IconMessageCircleSearch
        },
        {
            title: "Friends Finder",
            url: "#",
            icon: IconUsersPlus
        }
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#"
                },
                {
                    title: "Archived",
                    url: "#"
                }
            ]
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#"
                },
                {
                    title: "Archived",
                    url: "#"
                }
            ]
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#"
                },
                {
                    title: "Archived",
                    url: "#"
                }
            ]
        }
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch
        }
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: IconDatabase
        },
        {
            name: "Reports",
            url: "#",
            icon: IconReport
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: IconFileWord
        }
    ]
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
                                <IconInnerShadowTop className="!size-8" />
                                <span className="text-lg font-semibold">CeylonNomad.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
