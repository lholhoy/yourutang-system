import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axios";
import { Users, Wallet, TrendingUp, Loader2, Activity, ArrowUpRight, ArrowDownRight, Calendar, ChevronRight, Coins } from "lucide-react";
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

    const [filter, setFilter] = useState("this_year");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, logsRes, dueRes] = await Promise.all([
                    axiosClient.get("/analytics", { params: { filter } }),
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
            window.history.replaceState({}, document.title, window.location.pathname);
            setVerificationSuccess(true);
            setTimeout(() => setVerificationSuccess(false), 5000);
        }
    }, [filter]);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
                    <div className="h-96 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <Activity className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Error loading dashboard</h3>
                <p className="text-gray-500 mb-6 max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    if (!data) return null;

    const chartData = {
        labels: data.monthly_loans?.map((item) => item.label) || [],
        datasets: [
            {
                label: "Loans",
                data: data.monthly_loans?.map((item) => Number(item.total)) || [],
                fill: true,
                borderColor: "#0F9E99",
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, "rgba(15, 158, 153, 0.2)");
                    gradient.addColorStop(1, "rgba(15, 158, 153, 0)");
                    return gradient;
                },
                tension: 0.4,
                pointBackgroundColor: "#0F9E99",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: "Interest",
                data: data.monthly_interests?.map((item) => Number(item.total)) || [],
                fill: true,
                borderColor: "#F59E0B", // Amber-500
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, "rgba(245, 158, 11, 0.2)");
                    gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
                    return gradient;
                },
                tension: 0.4,
                pointBackgroundColor: "#F59E0B",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1f2937',
                padding: 12,
                titleFont: { size: 13 },
                bodyFont: { size: 13 },
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "#f3f4f6",
                    borderDash: [4, 4],
                },
                ticks: {
                    font: { size: 11 },
                    color: '#9ca3af'
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 11 },
                    color: '#9ca3af'
                }
            },
        },
    };

    return (
        <div className="space-y-8 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's your financial summary.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-border/50">
                    <Calendar className="w-4 h-4 text-primary" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {upcomingDue.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0 text-amber-500">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900">Upcoming Due Dates</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            You have <span className="font-bold text-amber-600">{upcomingDue.length} loan(s)</span> due within the next 7 days.
                        </p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingDue.map(loan => (
                                <div key={loan.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                                            {loan.borrower.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{loan.borrower.name}</p>
                                            <p className="text-xs text-gray-500">Due: {new Date(loan.due_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-amber-600 text-sm">₱{Number(loan.amount).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Card 1: Total Borrowers */}
                <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-8 -mt-8 opacity-50" />
                    <div className="relative z-10">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.total_borrowers}</h3>
                                    <p className="text-xs font-medium text-gray-500">Total Borrowers</p>
                                </div>
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                    <span>Active Users</span>
                                    <span className="text-blue-600">{data.total_borrowers > 0 ? Math.round((data.active_borrowers / data.total_borrowers) * 100) : 0}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.total_borrowers > 0 ? (data.active_borrowers / data.total_borrowers) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Total Loans */}
                <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -mr-8 -mt-8 opacity-50" />
                    <div className="relative z-10">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.total_loans}</h3>
                                    <p className="text-xs font-medium text-gray-500">Total Loans</p>
                                </div>
                                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                                    <Wallet className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                    <span>Active Loans</span>
                                    <span className="text-emerald-600">{data.total_loans > 0 ? Math.round((data.active_loans / data.total_loans) * 100) : 0}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.total_loans > 0 ? (data.active_loans / data.total_loans) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Outstanding Balance */}
                <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-8 -mt-8 opacity-50" />
                    <div className="relative z-10">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">₱{Number(data.total_outstanding).toLocaleString()}</h3>
                                    <p className="text-xs font-medium text-gray-500">Outstanding</p>
                                </div>
                                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                    <span>Collection Rate</span>
                                    <span className="text-purple-600">{data.total_principal > 0 ? Math.round((data.total_collected / data.total_principal) * 100) : 0}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-purple-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${data.total_principal > 0 ? (data.total_collected / data.total_principal) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Total Interest */}
                <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -mr-8 -mt-8 opacity-50" />
                    <div className="relative z-10">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">₱{Number(data.total_interest || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                                    <p className="text-xs font-medium text-gray-500">Total Interest</p>
                                </div>
                                <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                                    <Coins className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                    <span>ROI (Yield)</span>
                                    <span className="text-amber-600">{data.total_principal > 0 ? ((data.total_interest / data.total_principal) * 100).toFixed(1) : 0}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-amber-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${data.total_principal > 0 ? Math.min((data.total_interest / data.total_principal) * 100, 100) : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 border border-border/50 shadow-soft">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Loan Performance</h2>
                            <p className="text-sm text-gray-500 hidden sm:block">Loan disbursement overview</p>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
                            <button
                                onClick={() => setFilter("this_year")}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === "this_year" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Yearly
                            </button>
                            <button
                                onClick={() => setFilter("this_month")}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === "this_month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setFilter("last_year")}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === "last_year" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Last Year
                            </button>
                        </div>
                    </div>
                    <div className="h-64 sm:h-80 w-full">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* Top Borrowers */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-border/50 shadow-soft flex flex-col h-[450px]">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Top Borrowers</h2>
                    <p className="text-sm text-gray-500 mb-6">Highest outstanding balances</p>

                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {data.top_borrowers.map((borrower, index) => (
                            <div key={borrower.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-105 ${index === 0 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700' :
                                        index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700' :
                                                'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600'
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
                                </div>
                            </div>
                        ))}
                        {data.top_borrowers.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Users className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-sm">No borrowers yet</p>
                            </div>
                        )}
                    </div>
                    <Link to="/borrowers" className="w-full mt-4 btn btn-secondary justify-center text-sm py-2.5">
                        View All Borrowers
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-6 border border-border/50 shadow-soft">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                                <p className="text-sm text-gray-500">Latest system events</p>
                            </div>
                        </div>
                        <Link to="/history" className="text-sm font-medium text-primary hover:text-primary-700 flex items-center gap-1 group">
                            View All <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activityLogs.slice(0, 6).map((log) => (
                            <div key={log.id} className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-200 group">
                                <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform" />
                                <div>
                                    <p className="text-sm text-gray-900 line-clamp-2">
                                        <span className="font-semibold">{log.user?.name || 'System'}</span> {log.description}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(log.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {activityLogs.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500 text-sm">
                                No recent activity found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
