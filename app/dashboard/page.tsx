import React from 'react'
import CreateAgentSection from './_components/CreateAgentSection'
import AiAgentTab from './_components/AiAgentTab'

function Dashboard() {
    return (
<<<<<<< HEAD
        <div className="flex flex-col items-center justify-center w-full mt-20 p-4">
            <CreateAgentSection />
            <div className="w-full">
                <AiAgentTab />
=======
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground pt-4">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-[120px] opacity-60" />

            <div className="p-8 max-w-7xl mx-auto w-full relative z-10">
                <div className="mb-12 animate-fade-in text-center lg:text-left">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                        </span>
                        <span>Logic2Agent Control Center</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">
                        System <span className="text-primary italic drop-shadow-[0_0_20px_rgba(6,182,212,0.2)]">Overview</span>
                    </h1>
                    <p className="text-gray-400 text-lg font-light max-w-2xl leading-relaxed">
                        Orchestrating autonomous intelligence across your neural network. Monitor performance, manage agents, and scale your data flows.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { title: "AI Agents", value: "5", label: "Active Nodes", color: "primary" },
                        { title: "Data Sources", value: "12", label: "Linked Streams", color: "secondary" },
                        { title: "Tasks", value: "24", label: "Executions Today", color: "white" },
                        { title: "Credits", value: "1,250", label: "Neural Units", color: "accent" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-2xl rounded-3xl p-7 border border-white/5 hover:border-primary/30 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] group">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{stat.title}</h3>
                            <p className={`text-4xl font-black mt-4 text-${stat.color} group-hover:scale-105 transition-transform duration-500`}>{stat.value}</p>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                <div className={`h-1.5 w-1.5 rounded-full bg-${stat.color} animate-pulse shadow-[0_0_8px_currentColor] opacity-50`} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/5 shadow-2xl mb-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                            <h2 className="text-3xl font-black text-white tracking-tight">Recent Activity</h2>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-all px-6 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95">View All</button>
                    </div>
                    <div className="space-y-8">
                        {[
                            { title: "Agent Deployment", desc: 'New "Market Analyzer" node initialized', time: "12m ago", variant: "primary" },
                            { title: "Network Sync", desc: "Data streams aggregated successfully", time: "2h ago", variant: "secondary" },
                            { title: "System Boost", desc: "Response latency reduced by 14ms", time: "Yesterday", variant: "accent" }
                        ].map((activity, idx) => (
                            <div key={idx} className="flex items-start group">
                                <div className={`bg-${activity.variant}/10 border border-${activity.variant}/20 p-4 rounded-2xl mr-6 group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                                    <div className={`h-2.5 w-2.5 rounded-full bg-${activity.variant} animate-pulse shadow-[0_0_10px_currentColor]`} />
                                </div>
                                <div className="flex-1 border-b border-white/5 pb-8 group-last:border-0 group-last:pb-0">
                                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-primary transition-colors">{activity.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-400 text-sm font-light leading-relaxed">{activity.desc}</p>
                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
>>>>>>> 2178be55ee9e2fd6c5bf5617fa0cdb0c6c296d3d
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />
        </div>
    );
}

export default Dashboard