import Link from "next/link";
import { SignedIn, SignedOut } from '@clerk/nextjs';
import SpotlightBackground from "@/components/ui/spotlight-background";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Cpu, Zap } from "lucide-react";

export default function Home() {
  return (
    <SpotlightBackground>
      <div className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">

        {/* Main Content Centered */}
        <div className="flex flex-col items-center text-center space-y-10 pt-28 pb-20 max-w-4xl mx-auto">

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-md text-secondary text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-secondary/20 transition-all duration-300 animate-fade-in">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            </span>
            <span>Logic2Agent 1.0 Live</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-lg animate-fade-in">
            Next-Gen
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-secondary animate-pulse block sm:inline ml-2 sm:ml-4">
              Agentic Logic
            </span>
            <br className="hidden sm:block" />
            <span>Compiler</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light animate-fade-in">
            Transform static flowcharts into <span className="text-foreground font-medium border-b border-primary/30">autonomous AI agents</span>.
            The first visual reasoning compiler that deploys multi-agent systems directly to the web.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto animate-fade-in pt-4">
            <SignedOut>
              <Button size="lg" className="h-14 px-10 text-base rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white transition-all duration-300 transform hover:-translate-y-1 font-bold shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)] border-0" asChild>
                <Link href="/sign-up">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="h-14 px-10 text-base rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:-translate-y-1 font-bold shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)]" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <Zap className="ml-2 w-5 h-5 fill-current" />
                </Link>
              </Button>
            </SignedIn>
          </div>

          {/* Statistics Row */}
          <div className="grid grid-cols-3 gap-8 sm:gap-16 pt-8 border-t border-white/5 w-full max-w-[600px] animate-fade-in">
            <div className="group">
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-primary transition-colors duration-300">10k+</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Nodes</p>
            </div>
            <div className="group border-l border-white/5 pl-8 sm:pl-16">
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-secondary transition-colors duration-300">99%</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Success</p>
            </div>
            <div className="group border-l border-white/5 pl-8 sm:pl-16">
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-accent transition-colors duration-300">24/7</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </SpotlightBackground>
  );
}
