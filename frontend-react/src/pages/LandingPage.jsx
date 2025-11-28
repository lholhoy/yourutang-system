import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { ArrowRight, CheckCircle, Shield, TrendingUp, Users, Wallet } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo className="w-8 h-8" textClassName="text-xl" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="btn btn-primary px-4 py-2 text-sm shadow-lg shadow-primary/20"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Now with PDF Statements & Analytics
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        Smart Debt Management <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                            for Modern Lenders
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        Track loans, manage borrowers, and generate insights with ease. The all-in-one platform designed to simplify your lending business.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <Link
                            to="/register"
                            className="btn btn-primary px-8 py-3.5 text-lg shadow-xl shadow-primary/25 w-full sm:w-auto"
                        >
                            Start for Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors w-full sm:w-auto"
                        >
                            Live Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Powerful features built to help you track every peso and grow your lending operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Borrower Management</h3>
                            <p className="text-gray-500">
                                Keep detailed records of your borrowers, including contact info, loan history, and credit standing.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                                <Wallet className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Loan Tracking</h3>
                            <p className="text-gray-500">
                                Monitor active loans, calculate interest, and generate amortization schedules automatically.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Analytics</h3>
                            <p className="text-gray-500">
                                Visualize your cash flow, track outstanding balances, and identify your top performers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-primary text-sm font-medium mb-6 shadow-sm">
                                <Shield className="w-4 h-4" />
                                Enterprise Grade Security
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Your data is safe with us
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "Secure Authentication & Session Management",
                                    "Daily Database Backups",
                                    "Encrypted Data Transmission",
                                    "Role-Based Access Control"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full max-w-md">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gray-100" />
                                    <div>
                                        <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
                                        <div className="h-3 w-20 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-gray-100 rounded" />
                                    <div className="h-3 w-full bg-gray-100 rounded" />
                                    <div className="h-3 w-2/3 bg-gray-100 rounded" />
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <div className="h-8 w-24 bg-primary/10 rounded-lg" />
                                    <div className="h-8 w-8 bg-gray-100 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Logo className="w-6 h-6" textClassName="text-lg" />
                        <span className="text-gray-400 text-sm ml-4">© 2025 YourUtang. All rights reserved.</span>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
