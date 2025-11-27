import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, Wallet, History, LogOut, Menu, X } from "lucide-react";
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
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Borrowers', href: '/borrowers', icon: Users },
        { name: 'Loans', href: '/loans', icon: Wallet },
        { name: 'History', href: '/history', icon: History },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-border shadow-soft z-10">
                <div className="p-6 flex items-center gap-3 border-b border-border/50">
                    <Logo />
                </div>

                <nav className="flex-1 px-4 space-y-1.5 py-6">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                                location.pathname === item.href
                                    ? "bg-primary text-white shadow-md shadow-primary/25 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium"
                            )}
                        >
                            <item.icon className={clsx(
                                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                                location.pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-primary"
                            )} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border/50 bg-gray-50/50">
                    <Link to="/profile" className="flex items-center gap-3 mb-3 p-3 hover:bg-white rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-border hover:shadow-sm group">
                        {user?.profile_image ? (
                            <img src={`http://localhost:8000/storage/${user.profile_image}`} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold ring-2 ring-white shadow-sm">
                                {user?.name?.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 w-full text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-border z-20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Logo className="w-8 h-8" showText={true} textClassName="text-lg" />
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-border">
                    <span className="text-xl font-bold text-primary">Menu</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                location.pathname === item.href
                                    ? "bg-primary text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border bg-white">
                    <Link
                        to="/profile"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 mb-4 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                        {user?.profile_image ? (
                            <img src={`http://localhost:8000/storage/${user.profile_image}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto h-screen">
                <Toaster position="top-right" />
                <Outlet />
            </main>
        </div>
    );
}
