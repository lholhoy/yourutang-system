import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { Users, UserPlus, Loader2, Activity } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosClient.get("/admin/dashboard");
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching admin dashboard:", err);
                setError("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <Activity className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Error loading dashboard</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">System overview and statistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Users Card */}
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 opacity-50" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                            <h3 className="text-4xl font-bold text-gray-900">{stats.total_users}</h3>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                            <Users className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                {/* New Users Card */}
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 opacity-50" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">New Users (This Month)</p>
                            <h3 className="text-4xl font-bold text-gray-900">{stats.new_users_this_month}</h3>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                            <UserPlus className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
