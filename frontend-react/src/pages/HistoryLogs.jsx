import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { Clock, Loader2, Activity } from "lucide-react";

export default function HistoryLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        try {
            const response = await axiosClient.get(`/history?page=${page}`);
            if (page === 1) {
                setLogs(response.data.data);
            } else {
                setLogs((prev) => [...prev, ...response.data.data]);
            }
            setHasMore(!!response.data.next_page_url);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
        }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <Clock className="w-8 h-8" />
                    </div>
                    History Logs
                </h1>
                <p className="text-gray-500 mt-2 ml-14">View recent system activities and changes.</p>
            </div>

            <div className="bg-white rounded-2xl border border-border/50 shadow-soft overflow-hidden">
                <div className="divide-y divide-border/50">
                    {logs.map((log) => (
                        <div key={log.id} className="p-6 hover:bg-gray-50/50 transition-colors group relative">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-gray-100 rounded-full text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Activity size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                                        <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-lg">
                                            {log.user?.name || 'System'}
                                        </p>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200 self-start sm:self-auto">
                                            {formatDate(log.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-1 leading-relaxed">{log.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {logs.length === 0 && !loading && (
                        <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <Clock className="w-10 h-10 text-gray-300" />
                            </div>
                            <p className="font-bold text-gray-900 text-lg">No history logs found</p>
                            <p className="text-sm mt-1">Recent activities will appear here.</p>
                        </div>
                    )}
                </div>

                {hasMore && (
                    <div className="p-4 text-center border-t border-border/50 bg-gray-50/30">
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={loading}
                            className="btn btn-secondary w-full sm:w-auto"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </span>
                            ) : "Load More Activity"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
