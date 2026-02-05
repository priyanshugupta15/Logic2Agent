import React from 'react'
import DashboardProvider from './Provider'
import AppHeader from './_components/AppHeader'
import AppFooter from './_components/AppFooter'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarInset } from '@/components/ui/sidebar'

import SpotlightBackground from '@/components/ui/spotlight-background';

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <AppSidebar />
            <SidebarInset className="bg-transparent relative">
                <SpotlightBackground className="min-h-screen" contentClassName="min-h-screen">
                    <div className="flex flex-col h-screen w-full relative overflow-auto">
                        <div className="sticky top-0 left-0 right-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl">
                            <AppHeader />
                        </div>
                        <main id="dashboard-main" className="flex-grow p-0 relative">
                            {children}
                        </main>
                        <AppFooter />
                    </div>
                </SpotlightBackground>
            </SidebarInset>
        </DashboardProvider>
    )
}

export default DashboardLayout
