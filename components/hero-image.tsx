"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";

export default function HeroImage() {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for rotation
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

    // Map mouse position to rotation degrees
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Parallax for inner elements
    const imageTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-15px", "15px"]);
    const imageTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-15px", "15px"]);

    const badgeTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], ["10px", "-10px"]);
    const badgeTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], ["10px", "-10px"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="flex justify-center lg:justify-end py-12 lg:py-0">
            <div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full max-w-[500px] aspect-square perspective-1000"
                style={{ perspective: "1000px" }}
            >
                {/* Animated Background Glow (Behind Card) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/10 rounded-full blur-[80px] opacity-40 animate-pulse-slow z-0 pointer-events-none" />

                {/* 3D Rotating Card Container */}
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    className="relative w-full h-full z-10 transition-shadow duration-500"
                >
                    {/* Glass Card Background */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Moving Grid Pattern (Optional subtle texture) */}
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

                        {/* Inner Image with Parallax */}
                        <motion.div
                            style={{
                                x: imageTranslateX,
                                y: imageTranslateY,
                                z: 50,
                            }}
                            className="absolute inset-4 sm:inset-10 flex items-center justify-center transform-style-3d"
                        >
                            <Image
                                src="/hero.png"
                                alt="Logic2Agent Interface"
                                fill
                                className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                priority
                            />
                        </motion.div>

                        {/* Floating "System Operational" Badge */}
                        <motion.div
                            style={{
                                x: badgeTranslateX,
                                y: badgeTranslateY,
                                z: 200,
                            }}
                            className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 bg-black/60 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-3xl shadow-2xl flex items-center gap-4 group"
                        >
                            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                                <Cpu className="text-white w-6 h-6 relative z-10" />

                                {/* Shimmer on Icon Box */}
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-shine" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm tracking-wide truncate">System Operational</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <p className="text-xs text-primary/80 font-medium truncate">Processing Logic Flows...</p>
                                </div>
                            </div>

                            {/* Animated Dots */}
                            <div className="hidden sm:flex gap-1 self-center">
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3], height: [4, 12, 4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                    className="w-1 bg-green-500 rounded-full"
                                />
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3], height: [6, 16, 6] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                    className="w-1 bg-green-500 rounded-full"
                                />
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3], height: [4, 12, 4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                    className="w-1 bg-green-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative Floating Elements (Outside Card) */}
                    <motion.div
                        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 bg-gradient-to-br from-accent to-orange-500 p-3 rounded-2xl shadow-lg border border-white/10 z-20 hidden lg:block"
                    >
                        <Sparkles className="text-white w-6 h-6" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
