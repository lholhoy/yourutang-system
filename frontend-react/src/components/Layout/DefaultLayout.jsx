import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, Wallet, History, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import Logo from "../Logo";

export default function DefaultLayout() {
    const { user, token, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!token) {
        return <Navigate to="/login" />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Borrowers', href: '/borrowers', icon: Users },
        { name: 'Loans', href: '/loans', icon: Wallet },
        { name: 'History', href: '/history', icon: History },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans overflow-x-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-border shadow-soft z-20 fixed h-full transition-all duration-300">
                <div className="h-20 flex items-center px-8 border-b border-border/40">
                    <Logo />
                </div>

                <nav className="flex-1 px-4 space-y-2 py-8 overflow-y-auto custom-scrollbar">
                    <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Main Menu
                    </div>
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium"
                                )}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <item.icon className={clsx(
                                        "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                                        isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                                    )} />
                                    <span>{item.name}</span>
                                </div>
                                {isActive && (
                                    <ChevronRight className="w-4 h-4 text-white/80" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/40 bg-gray-50/30">
                    <div className="bg-white border border-border/50 rounded-2xl p-4 shadow-sm">
                        <Link to="/profile" className="flex items-center gap-3 mb-4 hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors group">
                            {user?.profile_image ? (
                                <img src={`https://api.yourutang.online/storage/${user.profile_image}`} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                                    {user?.name?.charAt(0)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </Link>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-border z-30 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Logo className="w-8 h-8" showText={true} textClassName="text-lg" />
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col shadow-2xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-20 flex items-center px-6 border-b border-border/40">
                    <Logo />
                </div>
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <div className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Menu
                    </div>
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium"
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-border/40 bg-gray-50/50">
                    <Link
                        to="/profile"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 mb-4 hover:bg-white p-2 -mx-2 rounded-xl transition-colors group"
                    >
                        {user?.profile_image ? (
                            <img src={`http://localhost:8000/storage/${user.profile_image}`} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold ring-2 ring-white shadow-sm">
                                {user?.name?.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full btn btn-danger py-2 text-xs flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
                {/* Top Bar (Desktop) */}
                <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-10 px-8 items-center justify-end">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </header>

                <div className="p-4 md:p-8 pt-20 md:pt-8 flex-1 overflow-y-auto overflow-x-hidden">
                    <Toaster position="top-right" toastOptions={{
                        className: 'font-medium text-sm',
                        style: {
                            borderRadius: '12px',
                            background: '#333',
                            color: '#fff',
                        },
                    }} />
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
