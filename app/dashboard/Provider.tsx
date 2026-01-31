"use client"
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

function DashboardProvider({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="w-full">
                {children}
            </div>
        </SidebarProvider>
    )
}

export default DashboardProvider
