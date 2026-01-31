import React from 'react'
import DashboardProvider from './Provider'
import AppHeader from './_components/AppHeader'
import AppFooter from './_components/AppFooter'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarInset } from '@/components/ui/sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden bg-transparent relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-0 relative">
                    {children}
                </main>
                <AppFooter />
            </SidebarInset>
        </DashboardProvider>
    )
}

export default DashboardLayout
