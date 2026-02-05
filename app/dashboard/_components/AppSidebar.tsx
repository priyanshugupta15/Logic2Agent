"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Headphones, Database, Home, Bot } from "lucide-react"
import { useContext } from "react"
import { UserDetailContext } from "@/context/UserDetailContext"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const MenuOptions = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard
    },
    {
        title: 'AI Agents',
        url: '/dashboard/ai-agents',
        icon: Headphones
    },
]

export function AppSidebar() {
    const { userDetail } = useContext(UserDetailContext);
    const { open, isMobile } = useSidebar();
    const pathname = usePathname();
    const agentList = useQuery(api.agent.getAgentList, userDetail?._id ? { userId: userDetail._id } : "skip");

    return (
        <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-white/5 bg-black/70 backdrop-blur-md md:h-svh md:sticky md:top-0">
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-4 p-5 group cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-shadow">
                        <Home className="text-primary h-6 w-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className={`font-black tracking-tight ${open ? 'text-2xl' : 'hidden'} transition-all duration-200 ease-in-out`}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 animate-pulse">Dashboard</span>

                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="mt-4 px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className={`${open ? 'text-[10px]' : 'hidden'} py-4 px-3 mb-2 transition-all duration-200 ease-in-out font-bold text-gray-500 uppercase tracking-[0.2em]`}>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => {
                                // Check if active based on path or base path for hash links
                                const isActive = pathname === menu.url || (menu.url.includes('#') && pathname === menu.url.split('#')[0]);
                                return (
                                    <SidebarMenuItem key={index} className="mb-2">
                                        <SidebarMenuButton
                                            asChild
                                            className={`py-6 px-4 rounded-2xl transition-all group ${isActive
                                                ? 'bg-primary/15 text-primary shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]'
                                                : 'hover:bg-primary/10 hover:text-primary'
                                                }`}
                                        >
                                            <Link href={menu.url} className="flex items-center gap-4">
                                                <menu.icon className={`h-6 w-6 transition-transform group-hover:scale-110 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : ''
                                                    } group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]`} />
                                                <span className={`${open ? 'text-lg' : 'hidden'} font-semibold transition-all duration-200 ease-in-out`}>{menu.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-6 mb-4 mt-auto">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        {open && (
                            <div>
                                <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Total Agents</h2>
                                <p className="text-xl font-black text-white">{agentList?.length || 0}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        {open && (
                            <div>
                                <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Favourite</h2>
                                <p className="text-xl font-black text-white">{agentList?.filter(agent => agent.starred)?.length || 0}</p>
                            </div>
                        )}
                    </div>

                </div>
            </SidebarFooter>
        </Sidebar>
    )
}