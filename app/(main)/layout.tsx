import React from 'react'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SpotlightBackground from "@/components/ui/spotlight-background";

function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SpotlightBackground>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
        </SpotlightBackground>
    )
}

export default MainLayout
