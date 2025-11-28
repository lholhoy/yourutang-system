import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { Users, Wallet, TrendingUp, Loader2, Activity } from "lucide-react";
import Skeleton from "../components/Skeleton";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [upcomingDue, setUpcomingDue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, logsRes, dueRes] = await Promise.all([
                    axiosClient.get("/analytics"),
                    axiosClient.get("/activity-logs"),
                    axiosClient.get("/loans/upcoming-due")
                ]);
                setData(analyticsRes.data);
                setActivityLogs(logsRes.data);
                setUpcomingDue(dueRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setError(error.response?.data?.message || error.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const params = new URLSearchParams(window.location.search);
        if (params.get('verified') === '1') {
            // Remove the query param without reloading
            window.history.replaceState({}, document.title, window.location.pathname);
            // Show success message (you might need to import toast if not already)
            // Assuming toast is available or we can use a simple alert/state for now
            // But let's use a state to show a nice banner
            setVerificationSuccess(true);
            setTimeout(() => setVerificationSuccess(false), 5000);
        }
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-10 w-48 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-9 w-48 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card p-6">
                            <div className="flex justify-between mb-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-10 w-32 mb-2" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 card p-6">
                        <div className="flex justify-between mb-6">
                            <Skeleton className="h-7 w-32" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                        <Skeleton className="h-80 w-full" />
                    </div>
                    <div className="card p-6">
                        <Skeleton className="h-7 w-32 mb-6" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div>
                                            <Skeleton className="h-4 w-32 mb-1" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Skeleton className="h-4 w-20 mb-1" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <p className="text-lg font-bold">Error loading dashboard</p>
                <p className="text-sm">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 btn btn-secondary"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) return null;

    const chartData = {
        labels: data.monthly_loans?.map((item) => item.month) || [],
        datasets: [
            {
                label: "Monthly Loans",
                data: data.monthly_loans?.map((item) => item.total) || [],
                fill: true,
                borderColor: "#0F9E99",
                backgroundColor: "rgba(15, 158, 153, 0.1)",
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "#f3f4f6",
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-border">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {upcomingDue.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg shrink-0">
                        <TrendingUp className="w-5 h-5 text-yellow-700" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-yellow-800">Upcoming Due Dates</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                            You have {upcomingDue.length} loan(s) due within the next 7 days.
                        </p>
                        <div className="mt-3 space-y-2">
                            {upcomingDue.map(loan => (
                                <div key={loan.id} className="flex justify-between items-center bg-white/50 p-2 rounded-lg text-sm">
                                    <span className="font-medium text-yellow-900">{loan.borrower.name}</span>
                                    <div className="flex gap-4">
                                        <span className="text-yellow-800">Due: {new Date(loan.due_date).toLocaleDateString()}</span>
                                        <span className="font-bold text-yellow-900">₱{Number(loan.amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 bg-blue-50 px-2.5 py-1 rounded-full">Total Borrowers</span>
                        </div>
                        <p className="text-4xl font-bold text-gray-900 tracking-tight">{data.total_borrowers}</p>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                            <span className="text-green-600 font-medium flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" /> +2.5%
                            </span>
                            from last month
                        </p>
                    </div>
                </div>

                <div className="card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 p-3 rounded-xl">
                                <Wallet className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 bg-green-50 px-2.5 py-1 rounded-full">Total Loans</span>
                        </div>
                        <p className="text-4xl font-bold text-gray-900 tracking-tight">{data.total_loans}</p>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                            <span className="text-green-600 font-medium flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" /> +12%
                            </span>
                            from last month
                        </p>
                    </div>
                </div>

                <div className="card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 bg-purple-50 px-2.5 py-1 rounded-full">Outstanding</span>
                        </div>
                        <p className="text-4xl font-bold text-gray-900 tracking-tight">
                            ₱{Number(data.total_outstanding).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Total unpaid amount</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Loan Trends</h2>
                        <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-primary focus:border-primary">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* Top Borrowers */}
                <div className="card p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Top Borrowers</h2>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {data.top_borrowers.map((borrower, index) => (
                            <div key={borrower.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-gray-100 text-gray-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                        {borrower.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{borrower.name}</p>
                                        <p className="text-xs text-gray-500">{borrower.loans_count} active loans</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                        ₱{Number(borrower.loans_sum_amount).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400">Outstanding</p>
                                </div>
                            </div>
                        ))}
                        {data.top_borrowers.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <Users className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">No borrowers yet</p>
                            </div>
                        )}
                    </div>
                    <button className="w-full mt-6 py-2.5 text-sm font-medium text-primary hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                        View All Borrowers
                    </button>
                </div>

                {/* Recent Activity */}
                <div className="card p-6 flex flex-col lg:col-span-3">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <Activity className="w-5 h-5 text-orange-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                    </div>

                    <div className="space-y-4">
                        {activityLogs.map((log) => (
                            <div key={log.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-900">
                                        <span className="font-semibold">{log.user?.name || 'System'}</span> {log.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(log.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {activityLogs.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
