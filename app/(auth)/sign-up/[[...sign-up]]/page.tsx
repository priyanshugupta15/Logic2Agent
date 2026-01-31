import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-[120px]" />
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 leading-tight">Get <span className="text-primary italic">Started</span></h1>
                    <p className="text-gray-400 text-sm tracking-wide uppercase font-bold opacity-70">Create your <span className="text-accent underline decoration-accent/30">Logic2Agent</span> account</p>
                </div>

                {/* Clerk Sign Up Component */}
                <div className="flex justify-center">
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-white/5 border border-white/5 shadow-2xl backdrop-blur-3xl rounded-[2rem]",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-white/5 border-white/5 hover:bg-white/10 text-white transition-all rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest",
                                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_10px_20px_rgba(6,182,212,0.3)]",
                                footerActionLink: "text-primary hover:text-primary active:scale-95 transition-all font-bold",
                                formFieldInput: "bg-white/5 border-white/5 text-white rounded-xl py-3 focus:ring-primary/50",
                                formFieldLabel: "text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2",
                                identityPreviewText: "text-white font-medium",
                                identityPreviewEditButton: "text-primary font-bold hover:text-white transition-colors",
                            }
                        }}
                        routing="path"
                        path="/sign-up"
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    Already have an account?{' '}
                    <a href="/sign-in" className="text-primary hover:text-primary font-black uppercase tracking-widest text-[10px] underline underline-offset-4 decoration-primary/30">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}
