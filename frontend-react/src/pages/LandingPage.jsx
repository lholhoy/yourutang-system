import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { ArrowRight, CheckCircle, Shield, TrendingUp, Users, Wallet, Star, ChevronRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo className="w-10 h-10" textClassName="text-2xl font-bold tracking-tight" />
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Header actions removed */}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 animate-pulse-slow" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 animate-pulse-slow delay-1000" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:bg-white/20 transition-colors cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                        </span>
                        New: Advanced Analytics & PDF Reports
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-[1.1]">
                        Lending made <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-200 to-teal-200 animate-gradient-x">
                            simple & smart
                        </span>
                    </h1>
                    <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 leading-relaxed">
                        The all-in-one platform to track loans, manage borrowers, and grow your lending business with confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <Link
                            to="/register"
                            className="btn btn-primary px-8 py-4 text-lg shadow-xl shadow-primary/25 w-auto hover:scale-105 transition-transform duration-300 group"
                        >
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Social Proof / Trust */}

                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Everything you need to succeed</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Powerful features built to help you track every peso and automate your operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                color: "blue",
                                title: "Borrower Management",
                                desc: "Keep detailed records of your borrowers, including contact info, loan history, and credit standing."
                            },
                            {
                                icon: Wallet,
                                color: "green",
                                title: "Loan Tracking",
                                desc: "Monitor active loans, calculate interest, and generate amortization schedules automatically."
                            },
                            {
                                icon: TrendingUp,
                                color: "purple",
                                title: "Smart Analytics",
                                desc: "Visualize your cash flow, track outstanding balances, and identify your top performers."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="relative p-8 rounded-3xl border border-transparent transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-white/20 backdrop-blur-sm">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-teal-50 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="flex-1 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-8 border border-white/10">
                                <Shield className="w-4 h-4" />
                                Enterprise Grade Security
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                                Your data is safe with us
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-lg">
                                We use bank-level encryption and security practices to ensure your financial data remains private and protected.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Secure Authentication & Session Management",
                                    "Daily Database Backups",
                                    "Encrypted Data Transmission (SSL/TLS)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-200">
                                        <div className="p-1 rounded-full bg-green-500/20 text-green-400">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full max-w-md relative z-10">
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-white/20" />
                                    <div>
                                        <div className="h-4 w-32 bg-white/20 rounded mb-2" />
                                        <div className="h-3 w-20 bg-white/10 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-3 w-full bg-white/10 rounded" />
                                    <div className="h-3 w-full bg-white/10 rounded" />
                                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                                    <div className="h-10 w-28 bg-primary rounded-xl shadow-lg shadow-primary/20" />
                                    <div className="h-8 w-8 bg-white/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Logo className="w-8 h-8" textClassName="text-xl font-bold" />
                            <span className="text-gray-300 text-2xl font-light">|</span>
                            <span className="text-gray-500 text-sm">© 2025 YourUtang. All rights reserved.</span>
                        </div>
                        <div className="flex gap-8 text-sm font-medium text-gray-500">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
