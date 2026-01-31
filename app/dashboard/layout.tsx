import React from 'react'
import DashboardProvider from './Provider'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <AppSidebar />
            <main className="w-full flex flex-col">
                <div className="p-4 border-b">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
        </DashboardProvider>
    )
}

export default DashboardLayout
