import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../Logo";

export default function GuestLayout() {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2" />
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-soft border border-border/50 p-8 relative z-10">
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-1 tracking-tight">YourUtang</h1>
                <p className="text-center text-gray-500 text-sm mb-2 font-medium tracking-wide">MANAGEMENT SYSTEM</p>
                <Outlet />
            </div>
        </div>
    );
}
